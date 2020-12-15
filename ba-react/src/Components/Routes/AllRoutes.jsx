import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import React, { useState, useEffect } from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import jwt_decode from 'jwt-decode';

function AllRoutes() {
  const [user, setUser] = useState()
  const [is_coach, setIs_coach] = useState(null)
  const [isAuth, setAuth] = useState(false)
  const [isRegis, setIsRegis] = useState(false)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    setLoad(false);
    setAuth(false);
    getTokenDetails();
  }, [])
  
  function getTokenDetails(){
    let token = localStorage.getItem("token");
    console.log("getToken")
    if(token){
      let decoded = jwt_decode(token);
      if(decoded.username && decoded.is_coach && decoded.user_id){
        setUser(decoded.username);
        setIs_coach(decoded.is_coach);
        console.log("setToken");
        setLoad(true);
        console.log("setLoad");
        setAuth(true);
      } else {
        setLoad(true);
        setAuth(false);
      }
    }
  }
  
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <LandingPage/>
          </Route>
          <Route path="/login">
            <Login load={load} isAuth={isAuth} setAuth={setAuth}/>
          </Route>
          <Route path="/register">
            <Register isRegis={isRegis} setIsRegis={setIsRegis}/>
          </Route>
          <BetterAthletes load={load} isAuth={isAuth} setAuth={setAuth} setUser={setUser} setIs_coach={setIs_coach} user={user} is_coach={is_coach}/>
        </Switch>
      </Router>
    )
}

export default AllRoutes
