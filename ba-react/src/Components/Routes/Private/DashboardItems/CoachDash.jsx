import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import CoachDashItems from './CoachDashItems'

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
