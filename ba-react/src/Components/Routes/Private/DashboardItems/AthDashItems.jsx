import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function AthDashItems({ data, empty, card }) {

    return (
        <Container>
            {data.length ?
                <table className='table table-borderless table-sm'>
                    <thead>
                        <tr>
                            <th scope="col"><h6 className="title display-7">
                                <div><b>Workout</b></div>
                                <div>{card === 'recent_completed' &&
                                    <span className="text-danger">*<span className="small">Pending coach review</span></span>
                                }</div></h6></th>
                            <th scope="col"><h6 className="title display-7"><b>Date</b></h6></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(el => (
                            <tr key={el.result_id}>
                                <td>
                                    <NavLink className="h6 nav-link" to={`view_workout/${el.result_id}`}>
                                        {el.workout_name}{(card === 'recent_completed' && !el.reviewed) &&
                                            <span className="text-danger small mx-3">*</span>
                                        }
                                    </NavLink>
                                </td>
                                <td width="1%">
                                    <div className="pt-1 pr-3 pl-2">{el.workout_date}</div>
                                </td>
                                <td width="1%">
                                    <NavLink className="btn btn-main btn-sm mt-1 mx-2" to={`view_workout/${el.workout_id}`}>View Workout</NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> :
                <Col>
                    <div className="mx-2 pt-4">{empty}</div>
                </Col>
            }
        </Container>
    )
}

export default AthDashItems
