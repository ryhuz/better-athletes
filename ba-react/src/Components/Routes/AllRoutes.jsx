import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import React, { useState, useEffect } from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import jwt_decode from 'jwt-decode';

function AllRoutes() {
  const [user, setUser] = useState()
  const [is_coach, setIs_coach] = useState(false)
  const [isAuth, setAuth] = useState(false)
  const [isRegis, setIsRegis] = useState(false)

  useEffect(() => {
    getTokenDetails()
  }, [])
  
  function getTokenDetails(){
    let token = localStorage.getItem("token");
    if(token){
      let decoded = jwt_decode(token);
      setUser(decoded.username);
      setIs_coach(decoded.is_coach);
    }
  }
  
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <LandingPage/>
          </Route>
          <Route path="/login">
            <Login isAuth={isAuth} setAuth={setAuth}/>
          </Route>
          <Route path="/register">
            <Register isRegis={isRegis} setIsRegis={setIsRegis}/>
          </Route>
          <BetterAthletes isAuth={isAuth} setAuth={setAuth} setUser={setUser} setIs_coach={setIs_coach} user={user} is_coach={is_coach}/>
        </Switch>
      </Router>
    )
}

export default AllRoutes
