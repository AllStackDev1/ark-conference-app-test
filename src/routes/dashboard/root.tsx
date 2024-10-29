import "react-toastify/dist/ReactToastify.css";
import cn from "classnames";
import { Fade } from "react-awesome-reveal";
import { ToastContainer } from "react-toastify";
import TopBarProgress from "react-topbar-progress-indicator";
import { NavLink, Outlet, useNavigation, useLocation } from "react-router-dom";

import { useAuthStore } from "src/stores";

TopBarProgress.config({
  barColors: {
    "0": "#C8FC7C",
    "1.0": "#C8FC7C",
  },
  shadowBlur: 5,
});

import Home from "src/assets/icons/home.svg?react";
import HomeActive from "src/assets/icons/home-active.svg?react";
import People from "src/assets/icons/people.svg?react";
import PeopleActive from "src/assets/icons/people-active.svg?react";

const menuLinks = [
  {
    title: "Home",
    path: "/home",
    icon: (isActive: boolean) => (isActive ? <HomeActive /> : <Home />),
  },
  {
    title: "Conference",
    path: "/conferences",
    disable: true,
    icon: (isActive: boolean) => (isActive ? <PeopleActive /> : <People />),
  },
];

const Root = () => {
  const location = useLocation();
  const navigation = useNavigation();

  const user = useAuthStore((state) => state.user);

  return (
    <main
      className={cn(
        navigation.state,
        "pt-16 xl:pt-0 xl:grid xl:grid-cols-6 w-full bg-primary-100 min-h-screen"
      )}
    >
      <div className="hidden xl:block xl:col-span-1 relative">
        <aside className="p-4 space-y-10">
          <div className="flex items-center py-3 px-4 space-x-2 border border-primary-600 rounded-lg w-">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
              alt={user?.firstName + " " + user?.lastName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xs">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <ul className="space-y-2 pl-3">
            {menuLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={(e) => item.disable && e.preventDefault()}
                  className={({ isActive }) =>
                    cn(
                      { "font-stabil font-medium": isActive },
                      { "text-black/60": !isActive },
                      "flex items-center space-x-4 py-2"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon(isActive)}
                      <span className="text-sm">{item.title}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="relative xl:col-span-5 p-4" id="main">
        {navigation.state == "loading" ? (
          <TopBarProgress />
        ) : (
          <div className="absolute inset-4 rounded-xl shadow-md border-[0.5px] bg-white border-gray-200 overflow-hidden">
            <div className="max-h-full overflow-auto">
              <Fade
                duration={3000}
                key={location.pathname}
                className="p-4 xl:p-8"
              >
                <Outlet />
              </Fade>
            </div>
          </div>
        )}
        <ToastContainer theme='dark' />
      </div>
    </main>
  );
};

export default Root;
