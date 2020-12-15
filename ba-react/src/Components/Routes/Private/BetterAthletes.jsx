import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import { Container } from "react-bootstrap"
import AddWorkOut from "./Workout/AddWorkOut"
import ViewWorkOut from "./Workout/ViewWorkOut"
import Dashboard from './Dashboard';
import AthleteProfile from './AthleteProfile';
import ViewClub from './ViewClub';
import CalendarDisplay from './Calendar/CalendarDisplay'

function BetterAthletes({ isAuth }) {
    console.log(isAuth)
    return (
        <>
            {isAuth.valid ?
                <Container className="border mt-5">
                    <Router>
                        <Switch>
                            <Route exact path="/betterathletes/add_new_workout">
                                <AddWorkOut />
                            </Route>
                            <Route exact path="/betterathletes/view_workout">
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
                            <Route exact path="/betterathletes/calendar">
                                <CalendarDisplay name="calendar" />
                            </Route>
                        </Switch>
                    </Router>
                </Container> :
                !isAuth.refreshed &&
                < Redirect to='/' />
            }
        </>
    )
}

export default BetterAthletes

