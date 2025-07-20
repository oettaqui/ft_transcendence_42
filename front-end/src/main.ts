


import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { RouteConfig } from "./types/RouteConfig";
import  {DashboardView} from "./views/DashboardView"
import { Router } from "./app/Router";



export const routes: RouteConfig[] = [
  { path: '/', view: HomeView},
  { path: '/login', view: LoginView},
  { path: '/register', view: RegisterView},
  { path: '/dashboard', view: DashboardView},
  // { path: '/dashboard/chat', view: ChatView}
  // { path: '/dashboard/game', view: GameView}
  // { path: '/dashboard/tournament', view: TournamentView}
  // { path: '/dashboard/settings', view: SettingsView}
  // { path: '/dashboard/profil', view: ProfileView}
];

const router = new Router(routes);



function setupNavigation(): void {

  router.handleRoute();


  window.addEventListener('popstate', () => {
    router.handleRoute();
  });


  document.addEventListener('click', (e) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href && target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(target.href).pathname;
      router.navigateTo(path);
    }
  });
}


window.addEventListener('DOMContentLoaded', setupNavigation);


