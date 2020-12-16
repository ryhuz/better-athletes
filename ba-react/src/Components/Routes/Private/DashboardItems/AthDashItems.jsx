import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AthDashItems({ data, empty }) {
    console.log(data)
    return (
        <>
            {data.length ?
                <>
                    <Col>
                        <Row>
                            <Col><h6>Workout</h6></Col>
                            <Col><h6>Date</h6></Col>
                            <Col></Col>
                        </Row>
                    </Col>
                    {data.map(el => (
                        <Col key={el.result_id}>
                            <Row>
                                <Col className="">
                                    <NavLink className="h6 nav-link" to={`view_workout/${el.result_id}`}>
                                        {el.workout_name}
                                    </NavLink>
                                </Col>
                                <Col className="">
                                    <div className="pt-2">{el.workout_date}</div>
                                </Col>
                                <Col className="text-center ">
                                    <NavLink className="btn btn-main btn-sm mt-1" to={`view_workout/${el.result_id}`}>View Workout</NavLink>
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </> :
                <Col>
                    <div className="mx-2 pt-4">{empty}</div>
                </Col>
            }
        </>
    )
}

export default AthDashItems
