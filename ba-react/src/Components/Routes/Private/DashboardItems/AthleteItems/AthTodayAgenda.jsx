import React from 'react'
import { Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AthTodayAgenda({ data }) {
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
                <div className="mx-2">Nothing on today!</div>
                </Col>
            }
        </>
    )
}

export default AthTodayAgenda
