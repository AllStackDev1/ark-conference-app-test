import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import children from "./routes";
import ErrorPage from "./error-page";

const router = createBrowserRouter([

  {
    children,
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
