import React, { useEffect } from 'react'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import { Container } from "react-bootstrap"
import InnerNaviBar from '../../InnerNaviBar';
import AddWorkOut from "./Workout/AddWorkOut"
import ViewWorkOut from "./Workout/ViewWorkOut"
import Dashboard from './Dashboard';
import AthleteProfile from './AthleteProfile';
import ViewClub from './ViewClub';
import CalendarDisplay from './Calendar/CalendarDisplay'
import { axiosInstance } from "../../../func/axiosApi"

function BetterAthletes({ isAuth, setAuth }) {
    useEffect(() => {
        async function verifyToken() {
            try {
                await axiosInstance.post("token/verify", {
                    'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                });
            } catch (error) {
                localStorage.removeItem("token");
                axiosInstance.defaults.headers['Authorization'] = null;
                setAuth({
                    valid: false,
                    load: false,
                    coach: false,
                    user: ""
                });
                console.log(error);
            }
        }
        verifyToken();
    }, [])

    if (!isAuth.valid) {
        return <Redirect to="/login" />
    }
    return (
        <Fragment>
            <InnerNaviBar user={isAuth.user} />
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
            </Container>
        </Fragment>
    )
}

export default BetterAthletes
