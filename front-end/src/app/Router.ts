

import { RouteConfig } from "../types/RouteConfig";
import { View } from "./View";
import { ErrorView404 } from "../views/Error/ErrorView404";
import { DashboardLayout } from "./DashboardLayout";


export class Router {
    private routes: RouteConfig[];
    private currentView: View | null;
    private currentLayout: View | null;
    private root: HTMLElement;

    constructor(routes: RouteConfig[]) {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            throw new Error('Root element not found! Make sure you have <div id="root"></div> in your HTML');
        }
        this.routes = routes;
        this.currentView = null;
        this.currentLayout = null;
        this.root = rootElement;
        this.handleRoute = this.handleRoute.bind(this);
        window.addEventListener('popstate', this.handleRoute);
        
        
    }

  async isLoggedIn(): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    try {
      const response = await fetch("http://localhost:3000/api/auth/isAuth", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 401) 
      {
        return false;
      }
      if (!response.ok) return false;

      return true;
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


    async handleRoute(){
      try {
        let currentPath = window.location.pathname;
        if (currentPath.length > 1 && currentPath.endsWith('/')) {
          currentPath = currentPath.slice(0, -1);
          history.replaceState(null, '', currentPath);
        }
        let route = this.routes.find(r => r.path === currentPath);
      
        if (!route) {
          console.warn(`Route not found: ${currentPath}. Redirecting to 404.`);
          route = { path: '/404', view: ErrorView404 };
          console.log(`EROOR Navigating to: ${route.path}`);
        }
        

        if (this.currentView) {
          console.log(' unMounting new view...');
          this.currentView.unMount();
        }
        if (this.currentLayout) {
          this.currentLayout.unMount();
          console.log(' unMounting new Layout...');
        }
        
      
        this.root.innerHTML = '';
        
        
        const ViewClass = route.view;
        this.currentView = new ViewClass();
        const allowedDashboardRoutes = [
          "/dashboard",
          "/dashboard/game",
          "/dashboard/chat",
          "/dashboard/settings",
          "/dashboard/profile",
          "/dashboard/tournament",
          "/dashboard/analytics"
        ];
        const anaccessiblePages = [
          "/",
          "/login",
          "/register"
        ];
        const loggedIn = await this.isLoggedIn(); 
        if (allowedDashboardRoutes.includes(currentPath)){
          if (!loggedIn) {
              this.navigateTo("/login");
              return;
          }
          this.currentLayout = new DashboardLayout(this.currentView, this);
          if (this.currentLayout)
            this.currentLayout.mount(this.root);
        }
        else if (anaccessiblePages.includes(currentPath) && loggedIn){
          console.log('here is the token ' + localStorage.getItem('token'));
          this.navigateTo('/dashboard');
          return;
        }
        else {
          console.log(' Mounting new view...');
          this.currentView.mount(this.root);
        }
        
        
    } catch (error) {
      console.log(error);
        this.root.innerHTML = `
          <div style="padding: 20px; text-align: center;">
            <h1>Something went wrong!</h1>
            <p>Please try refreshing the page.</p>
          </div>
        `;
    }
  }

  
}

  

   
