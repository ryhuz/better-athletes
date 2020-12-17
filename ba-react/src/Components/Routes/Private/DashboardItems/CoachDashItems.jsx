import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function CoachDashItems({ data, empty, card }) {
    return (
        <>
            {data.length ?
                <>
                    <Col>
                        <Row>
                            <Col><h6 className="title display-7"><b>Workout</b></h6></Col>
                            <Col md={1} className="ml-7"><h6 className="title display-7"><b>Date</b></h6></Col>
                            <Col></Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row xs={1}>
                            {data.map(el => (
                                <Col key={el.result_id}>
                                    <Row>
                                        <Col className="px-0 ml-2">
                                            <NavLink className="h6 nav-link" to={`view_workout/${el.result_id}`}>
                                                {el.workout_name}
                                            </NavLink>
                                        </Col>
                                        <Col md='auto' className="px-0 ml-3">
                                            <div className="pt-2">{el.workout_date}</div>
                                        </Col>
                                        <Col md='auto' className="px-3text-center">
                                            <NavLink className="btn btn-main btn-sm mt-1" to={`view_workout/${el.workout_id}`}>View Workout</NavLink>
                                        </Col>
                                    </Row>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </> :
                <Col>
                    <div className="mx-2 pt-4">{empty}</div>
                </Col>
            }
        </>
    )
}

export default CoachDashItems
