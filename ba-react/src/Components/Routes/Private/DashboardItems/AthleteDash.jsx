import React, { useState, useEffect } from 'react'
import { axiosInstance } from "../../../../func/axiosApi"
import { Row, Col } from 'react-bootstrap'
import AthDashItems from './AthDashItems'

function AthleteDash() {
    const title = ["Today's Agenda", 'Upcoming Workouts', 'Workouts Pending Your Results', 'Recently Completed']
    const keys = ['today', 'upcoming', 'pending_results', 'recent_completed']
    const empty = ["Nothing on today!", "You're all caught up!", "No upcoming workouts!", "Haven't done any workouts!"]
    const [dashData, setDashData] = useState({})
    const [axiosErr, setAxiosErr] = useState(false)
    useEffect(() => {
        async function retrieve() {
            try {
                let data = await axiosInstance.get(`dashboard`)
                setDashData(data.data)
            }
            catch (e) {
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
                            <div className={`border m-3 dash-card ${(card === "today" || card === "pending_athlete") && 'dash-card-scroll'}`}>
                                <div className="h4 py-3 px-2 text-center border">
                                    {title[index]}
                                </div>
                                <Row xs={1} className="px-4 pt-3">
                                    {Object.keys(dashData).length ?
                                        <AthDashItems data={dashData[card]} empty={empty[index]} key={card} /> :
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

export default AthleteDash
