// main.ts
import { router } from "./app/router-instance.ts";

function setupNavigation(): void {
  router.handleRoute();

  window.addEventListener('popstate', () => {
    router.handleRoute();
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLAnchorElement;
    const link = target.closest('a');

    if (link && link.href && link.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(link.href).pathname;
      router.navigateTo(path);
    }
  });
}

window.addEventListener('DOMContentLoaded', setupNavigation);