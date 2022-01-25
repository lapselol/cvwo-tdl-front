import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import axios from "axios";

import Home from "./Home";
import Dashboard from "./Dashboard";
import Registration from "./components/authentication/Registration";

export default function App() {
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
  const [loginStatus, setLoginStatus] = useState("LOGGED_IN");
  const [user, setUser] = useState({});

  const checkLoginStatus = () => {
    axios
      .get(`${API_ENDPOINT}/logged_in`, { withCredentials: true })
      .then((response) => {
        if (response.data.logged_in && loginStatus === "NOT_LOGGED_IN") {
          setLoginStatus("LOGGED_IN");
          setUser(response.data.user);
        } else if (!response.data.logged_in && loginStatus === "LOGGED_IN") {
          setLoginStatus("NOT_LOGGED_IN");
          setUser({});
        }
      })
      .catch((error) => {
        console.log("check login error", error);
      });
  };

  const authJWT = () => {
    if(localStorage.getItem("token")) {
      axios
        .get(`${API_ENDPOINT}/logged_in`, { withCredentials: true }, { 'headers': { 'Authenticate': localStorage.token } })
        .then(response => {
          setUser(response.data.user)
          console.log(response)
        })
    }
  }
  useEffect(() => {
    authJWT()
  }, []);

  const handleLogout = () => {
    setLoginStatus("NOT_LOGGED_IN");
    setUser({});
    localStorage.removeItem("token")
  };

  const handleLogin = (data) => {
    setLoginStatus("LOGGED_IN");
    setUser(data.user);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home handleLogin={handleLogin} />} />
        <Route
          path="/dashboard/*"
          element={
            <Dashboard handleLogout={handleLogout} />
          }
        />
        <Route
          path="/register"
          element={<Registration handleLogin={handleLogin} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
