import "./assets/styles/global.css";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useEffect } from "react";
import authRouters from "src/routes/auth/routers";
import dashboardRouters from "src/routes/dashboard/routers";

import { useAuthStore } from "src/stores";

const defaultOpenRoute = "/login";
const defaultClosedRoute = "/home";

const openedRoutes = authRouters.children.map(({ path }) => path);
const closedRoutes = dashboardRouters.children.map(({ path }) => path.split("/")[0]);

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const accessToken = useAuthStore((state) => state.accessToken);

  const currentPage = pathname.split("/")[1];

  useEffect(() => {
    if (accessToken) {
      if (closedRoutes.includes(currentPage)) {
        navigate(pathname);
      } else {
        navigate(defaultClosedRoute);
      }
    } else {
      if (openedRoutes.includes(currentPage)) {
        navigate(pathname);
      } else {
        navigate(defaultOpenRoute);
      }
    }
  }, [accessToken, pathname, navigate, currentPage]);

  return <Outlet />;
}

export default App;
