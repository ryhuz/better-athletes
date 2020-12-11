import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import LandingPage from "./Components/LandingPage"
import Navibar from './Components/Navibar';

function App() {

  return (
    <div className="App">
      
      <Router>
        <Navibar/>

        <Switch>
          <Route path="/" exact>
            <LandingPage/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
