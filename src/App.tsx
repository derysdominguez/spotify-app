import React, { useEffect } from "react";
import logo from "./logo.svg";
import Login from "./views/Login";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from "./hooks";
import { login, logout } from "./app/reducers/logginSlice";
import { useSelector } from "react-redux";
import Home from "./views/Home";
import { useAuth } from "./hooks/index";
import { useState } from "react";

function App() {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.isLogged.value);
  const access_token = new URLSearchParams(
    window.location.hash.substring(1)
  ).get("access_token");

  const local_token = useAuth(access_token);

  useEffect(() => {
    local_token ? dispatch(login()) : dispatch(logout());
  }, [local_token]);

  return <div>{isLogged ? <Home token={local_token} /> : <Login />}</div>;
}

export default App;
