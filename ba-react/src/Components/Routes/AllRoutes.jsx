import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import React from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"

function AllRoutes() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <LandingPage/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <BetterAthletes />
        </Switch>
      </Router>
    )
}

export default AllRoutes
