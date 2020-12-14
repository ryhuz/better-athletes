import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import React, { useEffect } from 'react'
import LandingPage from "./LandingPage/LandingPage"
import BetterAthletes from "./Private/BetterAthletes"
import Login from "./Auth/Login"
import Register from "./Auth/Register"

function AllRoutes() {
  const [user, setUser] = useState()
  const [is_coach, setIs_coach] = useState(false)

  useEffect(() => {
    getTokenDetails()
  }, [])
  
  function getTokenDetails(){
    let token = localStorage.getItem("token");
    let decoded = jwt_decode(token);
    setUser(decoded.username);
    setIs_coach(decoded.is_coach);
  }
  
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
