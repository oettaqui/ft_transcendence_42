

import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { ErrorView404 } from "./views/Error/ErrorView404";

type RouteConfig = {
  path: string;
  view: new () => { render: () => HTMLElement };
};


export const routes: RouteConfig[] = [
  { path: '/', view: HomeView},
  { path: '/login', view: LoginView},
  { path: '/register', view: RegisterView}
];


function renderCurrentRoute() {
  const root = document.getElementById('root');
  if (!root) return;


  const currentPath = window.location.pathname;
  let route = routes.find(r => r.path === currentPath);
  if (!route){
    route = {path : '/404', view: ErrorView404};
  }
  console.log(route);


  const ViewClass = route.view;
  const viewInstance = new ViewClass();
  const renderedElement = viewInstance.render();

  root.innerHTML = '';
  root.appendChild(renderedElement);
}


// document.addEventListener('DOMContentLoaded', renderCurrentRoute);
// window.addEventListener('popstate', renderCurrentRoute);

function navigateTo(path: string) {
  history.pushState(null, '', path);
  renderCurrentRoute();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCurrentRoute();

  // Intercept internal link clicks
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigateTo(href);
      }
    }
  });
});

window.addEventListener('popstate', renderCurrentRoute);