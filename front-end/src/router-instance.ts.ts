// router-instance.ts
import { Router } from "./app/Router";
import { routes } from "./router-config";

export const router = new Router(routes);