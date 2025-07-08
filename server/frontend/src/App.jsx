// Import necessary components and styles
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import Lobby from "./components/Lobby/Lobby";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Logout from "./components/Logout/Logout";

// Create browser router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/lobby",
    element: <Lobby />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/chatroom/:roomId",
    element: <ChatRoom />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

// component to render the RouteProvider with the defined router path
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
