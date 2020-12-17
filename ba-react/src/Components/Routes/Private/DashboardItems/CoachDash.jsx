import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import CoachDashItems from './CoachDashItems'
import { NavLink } from 'react-router-dom'

function CoachDash() {
    const title = ["Pending Your Review", "Today's Agenda", "Workouts Pending Athlete's Results", 'Recently Completed']
    const keys = ['pending_coach_review', 'today', 'pending_athlete', 'recent_completed']
    const empty = ["You're all caught up!", "Nothing on today!", "Your athletes are on the ball!", "No workout records"]
    const [dashData, setDashData] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)

    useEffect(() => {
        async function retrieve() {
            try {
                let headToken = {
                    headers: {
                        'Authorization': "JWT " + localStorage.getItem('token'),
                        'Content-Type': "application/json",
                        'accept': "application/json"
                    }
                }
                let data = await axios.get(`http://localhost:8000/api/dashboard`, headToken)
                setDashData(data.data)
            }
            catch (e) {
                console.log(e)
                setAxiosErr(true)
            }
        }
        retrieve()
    }, [])
    console.log(dashData);
    return (
        <>
            {axiosErr ?
                <Col>
                    <div className="border border-danger m-3">
                        <div className="h6 mt-2 mx-2 text-center">
                            Error fetching data
                    </div>
                    </div>
                </Col> :
                <>
                    <Col xs={12} md={12}>
                            <div className="border m-3 dash-card">
                                <div className="h4 py-3 px-2 text-center border">
                                    Tracked Athletes
                                </div>
                                <Row xs={1} className="px-4 pt-3">
                                    <Col>
                                        <Row>
                                            <Col className="col-6"><h6 className="title display-7"><b>Athlete Name</b></h6></Col>
                                            <Col className="col-3"><h6 className="title display-7"><b>Age</b></h6></Col>
                                            <Col className="col-3"><h6 className="title display-7"><b>Gender</b></h6></Col>
                                        </Row>
                                    </Col>
                                    {Object.keys(dashData).length ?
                                    <>
                                        <Col>
                                            <Row xs={1}>
                                                {dashData.tracked_athletes.map(el => (
                                                    <Col key={el.athlete_id}>
                                                        <Row className="text-left">
                                                            <Col className="px-0 col-6">
                                                                <NavLink className="h6 nav-link" to={`profile/${el.athlete_id}`}>
                                                                    {el.athlete_name}
                                                                </NavLink>
                                                            </Col>
                                                            <Col className="px-0 col-3">
                                                                <h6 className="pt-2">{el.athlete_age} y.o.</h6>
                                                            </Col>
                                                            <Col className="px-0 col-3">
                                                                <h6 className="pt-2">{el.athlete_gender==="F"?"Female":el.athlete_gender==="M"?"Male":"Prefer not to Say"}</h6>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </> : <>Loading....</>}
                                </Row>
                            </div>
                    </Col>
                    {keys.map((card, index) => (
                        <Col xs={12} md={6} key={index}>
                            <div className={`border m-3 dash-card ${(card==="today" || card==="pending_athlete") && 'dash-card-scroll'}`}>
                                <div className="h4 py-3 px-2 text-center border">
                                    {title[index]}
                                </div>
                                <Row xs={1} className="px-4 pt-3">
                                    {Object.keys(dashData).length ?
                                        <CoachDashItems data={dashData[card]} empty={empty[index]} key={card}/> :
                                        <>Loading....</>
                                    }
                                </Row>
                            </div>
                        </Col>
                    ))}
                </>
            }
        </>
    )
}

export default CoachDash
