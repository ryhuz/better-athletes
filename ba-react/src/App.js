import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import LandingPage from "./Components/Routes/LandingPage/LandingPage"
import BetterAthletes from "./Components/Routes/Private/BetterAthletes"
import AddNewWorkOut from "./Components/Routes/Private/WorkOut"
import { Fragment } from 'react';
import AllRoutes from "./Components/Routes/AllRoutes"

function App() {

  return (

    <Fragment>
      <AllRoutes/>
    </Fragment>
  );
}

export default App;
