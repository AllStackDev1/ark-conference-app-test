import Root from "./root";
import { Login } from "./login";
import { action as loginAction } from "./login/action";
import { action as registerAction } from "./register/action";

const authRouters = {
  path: "/",
  element: <Root />,
  children: [
    {
      path: "login",
      element: <Login />,
      action: loginAction,
    },
    {
      path: "register",
      lazy: async () => {
        const { Register } = await import("./register");
        return {
          Component: Register,
          action: registerAction,
        };
      },
    },
    {
      path: "forgot-password",
      lazy: async () => {
        const { ForgotPassword } = await import("./forgot-password");
        return {
          Component: ForgotPassword,
        };
      },
    },
  ],
};

export default authRouters;
