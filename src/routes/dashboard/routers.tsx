import { RouteObject } from "react-router-dom";

import { homeRouteLoader, conferenceRouteLoader } from "./loaders";
import {
  logoutAction,
  homeRouteAction,
  conferenceRouteAction,
} from "./actions";

import Root from "./root";

const dashboardRouters: RouteObject = {
  path: "/",
  element: <Root />,
  children: [
    {
      path: "logout",
      action: async function ({ request }) {
        if (request.method !== "POST") {
          throw new Response("Method Not Allowed", { status: 405 });
        }
      
        return logoutAction();
      },
      element: <div></div>,
    },
    {
      path: "home",
      shouldRevalidate: () => false,
      lazy: async () => {
        const { Home } = await import("./home");
        return {
          Component: Home,
          loader: homeRouteLoader,
          action: homeRouteAction,
        };
      },
    },
    {
      path: "conferences/:id",
      shouldRevalidate: () => false,
      lazy: async () => {
        const { Conference } = await import("./conference");
        return {
          element: <Conference />,
          action: conferenceRouteAction,
          loader: conferenceRouteLoader,
        };
      },
    },
  ],
};

export default dashboardRouters;
