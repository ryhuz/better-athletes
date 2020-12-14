import React from 'react'
import { Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function PendingCoachReview({ data }) {
    return (
        <>
            {data.length ?
                <>
                    {data.map(el=>(
                        <Col key={el.result_id}>
                            <NavLink className="nav-link" to="">
                                {el.athlete_name} - {el.workout_name}
                            </NavLink>
                        </Col>
                    ))}
                </>:
                <Col>
                    <div className="mx-2">You're all caught up!</div>
                </Col>
            }
        </>
    )
}

export default PendingCoachReview
