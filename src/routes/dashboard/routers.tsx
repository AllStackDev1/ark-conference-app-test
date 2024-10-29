import Root from "./root";

import { loader as homeLoader } from "./home/loader";
import { action as homeAction } from "./home/action";
import { loader as conferenceLoader } from "./conference/loader";
import { action as conferenceAction } from "./conference/action";

const dashboardRouters = {
  path: "/",
  element: <Root />,
  children: [
    {
      path: "Home",
      shouldRevalidate: () => false,
      lazy: async () => {
        const { Home } = await import("./home");
        return {
          Component: Home,
          loader: homeLoader,
          action: homeAction,
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
          action: conferenceAction,
          loader: conferenceLoader,
        };
      },
    },
  ],
};

export default dashboardRouters;
