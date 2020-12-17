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
import AddWorkOut from "./Private/Workout/AddWorkOut"
import ViewWorkOut from "./Private/Workout/ViewWorkOut"
import Dashboard from './Private/Dashboard';
import AthleteProfile from './Private/AthleteProfile';
import ViewClub from './Private/ViewClub';
import CalendarDisplay from './Private/Calendar/CalendarDisplay'

function AllRoutes() {
  const [isAuth, setAuth] = useState({
    valid: false,
    refreshed: true,
    coach: false,
    user: "",
    user_id: ""
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
        user: "",
        user_id: "",
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
          user: decoded.username,
          user_id: decoded.user_id
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
        setAuth({
          valid: false,
          refreshed: false,
          coach: null,
          user: "",
          user_id: "",
        });
      }
    }

    getTokenDetails();
  }, [])

  return (
    <Router>
      {isAuth.valid ?
        <NavBarLoggedIn coach={isAuth.coach} username={isAuth.user} user_id={isAuth.user_id} /> :
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
        <BetterAthletes isAuth={isAuth} component={AddWorkOut} path="/betterathletes/add_new_workout" />
        <BetterAthletes isAuth={isAuth} component={ViewWorkOut} path="/betterathletes/view_workout/:id" />
        <BetterAthletes isAuth={isAuth} component={Dashboard} path="/betterathletes/dashboard" />
        <BetterAthletes isAuth={isAuth} component={AthleteProfile} path="/betterathletes/profile/:id" />
        <BetterAthletes isAuth={isAuth} component={ViewClub} path="/betterathletes/myclub" />
        <BetterAthletes isAuth={isAuth} component={CalendarDisplay} path="/betterathletes/calendar/:id" />
        <BetterAthletes isAuth={isAuth} component={Dashboard} path="/betterathletes/" />
      </Switch>
    </Router>
  )
}

export default AllRoutes
