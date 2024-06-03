import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Dashboard from "./components/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
    errorElement: <div>404 you are in the wrong place</div>,
  },
  {
    path: "/register",
    element: <SignUp />,
    errorElement: <div>404 you are in the wrong place</div>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <div>404 you are in the wrong place</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RouterProvider>
);
