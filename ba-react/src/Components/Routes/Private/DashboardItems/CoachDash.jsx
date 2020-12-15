import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import PendingCoachReview from './CoachItems/PendingCoachReview'
import TodaysAgenda from './CoachItems/TodaysAgenda'
import PendingAthlete from './CoachItems/PendingAthlete'
import RecentlyCompleted from './CoachItems/RecentlyCompleted'

function CoachDash() {
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
    return (
        <>
        {axiosErr ?
            /* shows error if can't fetch axios */
            <Col>
                <div className="border border-danger m-3">
                    <div className="h6 mt-2 mx-2 text-center">
                        Error fetching data
                    </div>
                </div>
            </Col> :
            <>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Pending Your Review
                        </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <PendingCoachReview data={dashData.pending_coach_review} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Today's Agenda
                </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <TodaysAgenda data={dashData.today} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Workouts Pending Athlete's Results
                </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <PendingAthlete data={dashData.pending_athlete} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Recently Completed
                </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <RecentlyCompleted data={dashData.recent_completed} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
            </>
        }
        </>
    )
}

export default CoachDash
