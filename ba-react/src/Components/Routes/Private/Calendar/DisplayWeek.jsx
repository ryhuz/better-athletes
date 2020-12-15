import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';

function DisplayWeek({ week, workouts, relative }) {
    console.log(workouts);
    return (
        <Row>
            {workouts ? 
            <>
            {week.map(day => (
                <Col key={day} className="border overflow-auto wkout-day">
                    <span className={`${(day.format('dd')==="Su" || day.format('dd')==="Sa") && 'text-danger'}`}>{day.format("Do")}</span>
                    {workouts.map((x,i) => (
                    <NavLink to="/betterathletes/view_workout" style={{ textDecoration: 'none' }}>
                    {day.format('YYYY-MM-DD')==x.workout_date&&
                    <div key={i} id={x.workout_id}>{x.workout_name}</div>}
                    </NavLink>
                    ))}
                </Col>
            ))}
            </> : 
            <div>
            Loading ...
            </div>}
        </Row>
    )
}

export default DisplayWeek
