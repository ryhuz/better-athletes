import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import jwt_decode from 'jwt-decode';
import Logout from "./Auth/Logout"

function AllRoutes() {
  const [isAuth, setAuth] = useState({
    valid: false,
    load: false,
    coach: false,
    user: ""
  })

  useEffect(() => {
    function getTokenDetails() {
      let token = localStorage.getItem("token");
      if (token != null) {
        let decoded = jwt_decode(token);
        if (decoded.username && decoded.is_coach && decoded.user_id) {
          return setAuth({
            valid: true,
            load: true,
            coach: decoded.is_coach,
            user: decoded.username
          });
        }
      }
    }
    getTokenDetails();
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="/login">
          <Login isAuth={isAuth} setAuth={setAuth} />
        </Route>
        <Route path="/register">
          <Register isAuth={isAuth} setAuth={setAuth} />
        </Route>
        <Route path="/logout">
          <Logout isAuth={isAuth} setAuth={setAuth} />
        </Route>
        <BetterAthletes isAuth={isAuth} setAuth={setAuth} is_coach={isAuth.coach} />
      </Switch>
    </Router>
  )
}

export default AllRoutes
