import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import AddWorkOut from "./Workout/AddWorkOut"
import ViewWorkOut from "./Workout/ViewWorkOut"
import Dashboard from './Dashboard';
import AthleteProfile from './AthleteProfile';
import ViewClub from './ViewClub';
import CalendarDisplay from './Calendar/CalendarDisplay'

function BetterAthletes({ isAuth }) {
    return (
        <div className="full-height landing">
            {isAuth.valid ?
                <>
                    <Router>
                        <Switch>
                            <Route exact path="/betterathletes/add_new_workout">
                                <AddWorkOut isAuth={isAuth} />
                            </Route>
                            <Route exact path="/betterathletes/view_workout/:id">
                                <ViewWorkOut />
                            </Route>
                            <Route exact path="/betterathletes/dashboard">
                                <Dashboard name="dashboard" isAuth={isAuth} />
                            </Route>
                            <Route exact path="/betterathletes/profile/:id">
                                <AthleteProfile name="profile" />
                            </Route>
                            <Route exact path="/betterathletes/myclub">
                                <ViewClub name="view_club" />
                            </Route>
                            <Route exact path="/betterathletes/calendar/:id">
                                <CalendarDisplay name="calendar" />
                            </Route>
                        </Switch>
                    </Router>
                </> :
                !isAuth.refreshed &&
                < Redirect to='/login' />
            }
        </div>
    )
}

export default BetterAthletes

