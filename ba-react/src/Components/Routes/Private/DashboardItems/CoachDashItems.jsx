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
                            <Col md={3}><h6 className="title display-7"><b>Date</b></h6></Col>
                            <Col></Col>
                        </Row>
                    </Col>
                    <Row xs={1} className="">
                        {data.map(el => (
                            <Col key={el.result_id}>
                                <Row>
                                    <Col className="">
                                        <NavLink className="h6 nav-link" to={`view_workout/${el.result_id}`}>
                                            {el.workout_name}
                                        </NavLink>
                                    </Col>
                                    <Col md={3} className="ml-2 pl-4">
                                        <div className="pt-2">{el.workout_date}</div>
                                    </Col>
                                    <Col className="text-center ">
                                        <NavLink className="btn btn-main btn-sm mt-1" to={`view_workout/${el.workout_id}`}>View Workout</NavLink>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </> :
                <Col>
                    <div className="mx-2 pt-4">{empty}</div>
                </Col>
            }
        </>
    )
}

export default CoachDashItems
