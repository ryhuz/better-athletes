import React from 'react'
import { Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AthRecentlyCompleted({ data }) {
    return (
        <>
            {data.length ?
                <>
                    {data.map(el=>(
                        <Col key={el.result_id}>
                            <NavLink className="nav-link" to="">
                                {el.athlete_name} - {el.workout_name}
                                {!el.reviewed && 
                                    <span className="text-danger small mx-3">*Pending coach review</span>
                                }
                            </NavLink>
                        </Col>
                    ))}
                </>:
                <Col>
                    <div className="mx-2">Haven't done any workouts!</div>
                </Col>
            }
        </>
    )
}

export default AthRecentlyCompleted
