import React from 'react'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import InnerNaviBar from '../../InnerNaviBar';
import WorkOut from "./WorkOut"
import Dashboard from './Dashboard';




function BetterAthletes() {
    return (
        <Fragment>
            <InnerNaviBar />
            <Container className="border mt-5">
                <Router>
                    <Switch>

                        <Route exact path="/betterathletes/add_new_workout">
                            <WorkOut name="add_new_workout" />
                        </Route>

                        <Route exact path="/betterathletes/view_workout">
                            <WorkOut name="view_workout" />
                        </Route>

                        <Route exact path="/betterathletes/dashboard">
                            <Dashboard name="dashboard" />
                        </Route>

                    </Switch>
                </Router>
            </Container>
        </Fragment>
    )
}

export default BetterAthletes
