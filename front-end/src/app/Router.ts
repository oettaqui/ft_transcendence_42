

import { RouteConfig } from "../types/RouteConfig";
import { View } from "./View";
import { ErrorView404 } from "../views/Error/ErrorView404";

export class Router {
    private routes: RouteConfig[];
    private currentView: View | null;
    private root: HTMLElement;

    constructor(routes: RouteConfig[]) {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            throw new Error('Root element not found! Make sure you have <div id="root"></div> in your HTML');
        }
        this.routes = routes;
        this.currentView = null;
        this.root = rootElement;
        
        
    }

    public handleRoute(){
      try {
        const currentPath = window.location.pathname;
        let route = this.routes.find(r => r.path === currentPath);
      
        if (!route) {
          console.warn(`Route not found: ${currentPath}. Redirecting to 404.`);
          route = { path: '/404', view: ErrorView404 };
        }
        
        console.log(`🔄 Navigating to: ${route.path}`);

        if (this.currentView) {
          console.log('🧹 Unmounting previous view...');
          this.currentView.unmount();
        }

      
        this.root.innerHTML = '';

    
        const ViewClass = route.view;
        this.currentView = new ViewClass();
        
        console.log('📱 Mounting new view...');
        this.currentView.mount(this.root);
        
        console.log('✅ View mounted successfully!');
        
    } catch (error) {
        console.error('❌ Error during navigation:', error);
        
        
        this.root.innerHTML = `
          <div style="padding: 20px; text-align: center;">
            <h1>Something went wrong!</h1>
            <p>Please try refreshing the page.</p>
          </div>
        `;
    }
  }

  public navigateTo(path: string) {
    history.pushState(null, '', path);
    this.handleRoute();
  }


}

  

   
