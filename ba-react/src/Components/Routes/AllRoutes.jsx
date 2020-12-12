import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import React from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"

function AllRoutes() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <LandingPage/>
          </Route>
          <BetterAthletes />
        </Switch>
      </Router>
    )
}

export default AllRoutes
