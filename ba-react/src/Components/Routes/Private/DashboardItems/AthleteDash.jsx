import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import AthTodayAgenda from './AthleteItems/AthTodayAgenda'
import AthUpcoming from './AthleteItems/AthUpcoming'
import AthRecentlyCompleted from './AthleteItems/AthRecentlyCompleted'
import AthPendingResults from './AthleteItems/AthPendingResults'

function AthleteDash() {
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
                let data = await axios.get(`http://localhost:8000/api/testing`, headToken)
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
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Today's Agenda
                        </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <AthTodayAgenda data={dashData.today} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Upcoming Workouts
                        </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <AthUpcoming data={dashData.upcoming} /> :
                                <>Loading....</>
                            }
                        </Row>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="border m-3">
                        <div className="h6 mt-2 mx-2">
                            Workouts Pending Your Results
                        </div>
                        <Row xs={1}>
                            {Object.keys(dashData).length ?
                                <AthPendingResults data={dashData.pending_results} /> :
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
                                <AthRecentlyCompleted data={dashData.recent_completed} /> :
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

export default AthleteDash
