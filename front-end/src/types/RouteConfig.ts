
import { View } from "../app/View";

export type RouteConfig = {
    path: string;
    view: new () => View;
    // view: typeof View;
};
