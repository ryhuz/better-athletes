import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import jwt_decode from 'jwt-decode';
import Logout from "./Auth/Logout"
import Landing from "./LandingPage/Landing"
import { axiosInstance } from "../../func/axiosApi";
import NavBarLoggedIn from "../NavBars/NavBarLoggedIn"
import NavBarNotLoggedIn from "../NavBars/NavBarNotLoggedIn"

function AllRoutes() {
  const [isAuth, setAuth] = useState({
    valid: false,
    refreshed: true,
    coach: false,
    user: ""
  })

  useEffect(() => {
    let token = localStorage.getItem("token");
    function removeToken() {
      localStorage.removeItem("token");
      axiosInstance.defaults.headers['Authorization'] = null;
      return setAuth({
        valid: false,
        refreshed: false,
        coach: false,
        user: ""
      });
    }

    async function verifyToken() {
      try {
        await axiosInstance.post("token/verify", {
          'token': token,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        });
        let decoded = jwt_decode(token);
        return setAuth({
          valid: true,
          refreshed: false,
          coach: decoded.is_coach,
          user: decoded.username
        });
      } catch (error) {
        removeToken()
      }
    }

    function getTokenDetails() {
      if (token != null) {
        let decoded = jwt_decode(token);
        if (decoded.username && decoded.user_id && decoded.is_coach !== undefined) {
          verifyToken()
        } else {
          removeToken()
        }
      } else {
        return setAuth({
          valid: false,
          refreshed: false,
          coach: null,
          user: ""
        });
      }
    }

    getTokenDetails();
  }, [])

  return (
    <Router>
      {isAuth.valid ?
        <NavBarLoggedIn /> :
        <NavBarNotLoggedIn />}
      <Switch>
        <Route path="/" exact>
          <Landing isAuth={isAuth} />
        </Route>
        {/* Accounts */}
        <Route path="/login">
          <Login isAuth={isAuth} setAuth={setAuth} />
        </Route>
        <Route path="/logout">
          <Logout isAuth={isAuth} setAuth={setAuth} />
        </Route>
        <Route path="/register">
          <Register isAuth={isAuth} setAuth={setAuth} />
        </Route>
        {/* Logged in route */}
        <BetterAthletes isAuth={isAuth} />
      </Switch>
    </Router>
  )
}

export default AllRoutes
