
   
import { RouteConfig } from "../types/RouteConfig";
import { View } from "./View";
import { ErrorView404 } from "../views/Error/ErrorView404";
import { DashboardLayout } from "./DashboardLayout";

export class Router {
  private routes: RouteConfig[];
  private currentView: View | null;
  private currentLayout: DashboardLayout | null;
  private root: HTMLElement;

  constructor(routes: RouteConfig[]) {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found! Make sure you have <div id="root"></div> in your HTML');
    this.routes = routes;
    this.currentView = null;
    this.currentLayout = null;
    this.root = rootElement;
    this.handleRoute = this.handleRoute.bind(this);
    window.addEventListener('popstate', this.handleRoute);
  }

  async isLoggedIn(): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const response = await fetch("http://localhost:3000/api/auth/isAuth", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) return false;
      return response.ok;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return false;
    }
  }

  public navigateTo(path: string) {
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
      history.replaceState(null, '', path);
    }
    history.pushState(null, '', path);
    this.handleRoute();
  }

  async handleRoute() {
    try {
      let currentPath = window.location.pathname;
      if (currentPath.length > 1 && currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
        history.replaceState(null, '', currentPath);
      }

      // --- START: MODIFICATION FOR DYNAMIC ROUTES ---
      let match = null;
      let params = {};

      for (const route of this.routes) {
        // Convert route path to a regex: /dashboard/profile/:id -> /^\/dashboard\/profile\/([^\/]+)$/
        const regex = new RegExp("^" + route.path.replace(/:\w+/g, "([^\\/]+)") + "$");
        const potentialMatch = currentPath.match(regex);

        if (potentialMatch) {
          // Get the values from the URL (e.g., ['/dashboard/profile/42', '42'])
          const values = potentialMatch.slice(1);
          // Get the keys from the route path (e.g., ['id'])
          const keys = Array.from(route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
          
          // Combine keys and values into a params object: { id: '42' }
          params = Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
          }));
          
          match = route;
          break; // Stop searching once a match is found
        }
      }

      let route = match;
      // --- END: MODIFICATION FOR DYNAMIC ROUTES ---

      // let route = this.routes.find(r => r.path === currentPath);
      if (!route) {
        console.warn(`Route not found: ${currentPath}. Redirecting to 404.`);
        route = { path: '/404', view: ErrorView404 };
      }

      if (this.currentView) {
          console.log(' unMounting new view...');
          this.currentView.unMount();
      }
      const ViewClass = route.view;
      // this.currentView = new ViewClass();
      console.log("params ==> ", params);
      this.currentView = new ViewClass(params); 

      const allowedDashboardRoutes = [
        "/dashboard",
        "/dashboard/game",
        "/dashboard/game/localgame",
        "/dashboard/game/gamewithIA",
        "/dashboard/chat",
        "/dashboard/settings",
        // "/dashboard/profile",
        "/dashboard/tournament",
        "/dashboard/analytics",
      ];
      const isDashboardRoute = allowedDashboardRoutes.includes(currentPath) || currentPath.startsWith('/dashboard/profile/');
      const publicPages = ["/", "/login", "/register"];

      const loggedIn = await this.isLoggedIn();

      // if (allowedDashboardRoutes.includes(currentPath)) {
      if (isDashboardRoute) {
        if (!loggedIn) { this.navigateTo("/login"); return; }
        

        if (!this.currentLayout) {
          this.currentLayout = new DashboardLayout(this.currentView, this);
          await this.currentLayout.mount(this.root);
        } else {
          this.currentLayout.setChildView(this.currentView);
        }
        return;
      }
      else if (publicPages.includes(currentPath) && loggedIn){
          console.log('here is the token ' + localStorage.getItem('token'));
          this.navigateTo('/dashboard');
          return;
        }

      if (this.currentLayout) {
        this.currentLayout.unMount();
        this.currentLayout = null;
      }

      this.root.innerHTML = '';
      if (this.currentView && typeof this.currentView.mount === 'function') {
        this.currentView.mount(this.root);
      } else if (this.currentView && typeof (this.currentView as any).render === 'function') {
        const el = (this.currentView as any).render();
        if (el) this.root.appendChild(el);
        if (typeof (this.currentView as any).onMount === 'function') (this.currentView as any).onMount();
      }

    } catch (error) {
      console.error(error);
      this.root.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Something went wrong!</h1>
          <p>Please try refreshing the page.</p>
        </div>
      `;
    }
  }
}