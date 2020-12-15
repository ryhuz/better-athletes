import React from 'react'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import InnerNaviBar from '../../InnerNaviBar';
import AddWorkOut from "./AddWorkOut"
import ViewWorkOut from "./ViewWorkOut"
import Dashboard from './Dashboard';
import { useState } from 'react';

function BetterAthletes({load, setUser, setIs_coach, user, is_coach}) {
    const [isAuth, setAuth] = useState(true)

    return (
        <Fragment>
            <InnerNaviBar setIs_coach={setIs_coach} isAuth={isAuth} setAuth={setAuth} user={user} />
            <Container className="border mt-5">
                <Router>
                <Switch>
                    <Route exact path="/betterathletes/add_new_workout">
                        <AddWorkOut/>
                    </Route>
                    <Route exact path="/betterathletes/view_workout">
                        <ViewWorkOut />
                    </Route>
                    <Route exact path="/betterathletes/dashboard">
                            <Dashboard name="dashboard" load={load} isAuth={isAuth} setAuth={setAuth} setUser={setUser} setIs_coach={setIs_coach} user={user} is_coach={is_coach}/>
                    </Route>
                </Switch>
                </Router>
            </Container>
        </Fragment>
    )
}

export default BetterAthletes
