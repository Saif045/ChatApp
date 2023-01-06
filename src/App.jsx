import { ToggleButton } from "@mui/material";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import "./index.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { currentUser } = useContext(AuthContext);

  const PtotectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }
    return children
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          index
          element={
            <PtotectedRoute>
              <Home />
            </PtotectedRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

const Root = () => {
  return (
    <>
      {/* > NAVBAR < */}
      <Outlet />
    </>
  );
};
