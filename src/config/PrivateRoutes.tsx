import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";

const PrivateRoute = () => {
  const isLogged = useAppSelector((state) => state.isLogged.value);

  if (isLogged) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;