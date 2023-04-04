import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Game from "./Pages/Game";
import UserProvider from "./functions/User";
import { socket, SocketContext } from "./socket";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/room/:gameId",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SocketContext.Provider value={socket}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </SocketContext.Provider>
);
