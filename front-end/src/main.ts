


import { LandingPageView } from "./views/LandingPageView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { RouteConfig } from "./types/RouteConfig";

import { Router } from "./app/Router";
import { HomeView } from "./views/HomeView";
import { GameView } from "./views/GameView";



export const routes: RouteConfig[] = [
  { path: '/', view: LandingPageView},
  { path: '/login', view: LoginView},
  { path: '/register', view: RegisterView},
  { path: '/dashboard', view: HomeView},
  { path: '/dashboard/game', view: GameView}
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
    const link = target.closest('a');

    if (
      link &&
      link.href &&
      link.href.startsWith(window.location.origin)
    ) {
      e.preventDefault();
      const path = new URL(link.href).pathname;
      router.navigateTo(path);
    }
  });
}


window.addEventListener('DOMContentLoaded', setupNavigation);


