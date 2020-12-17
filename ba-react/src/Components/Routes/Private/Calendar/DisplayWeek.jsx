import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';

function DisplayWeek({ week, workouts, relative }) {
    function showAddWorkout(e) {
        let addButton = e.currentTarget.childNodes[1].firstChild;
        addButton.classList.add('btn-outline-success', 'btn', 'btn-xs', 'btn-block');
        addButton.innerText = "+";
    }
    function hideAddWorkout(e) {
        let addButton = e.currentTarget.childNodes[1].firstChild;
        addButton.classList.remove('btn', 'btn-outline-success', 'btn-xs', 'btn-block');
        addButton.innerText = "";
    }
    return (
        <Row>
            <>
                {week.map(day => (
                    <Col key={day} className={`border overflow-auto cal-day ${relative === "prev" ? "cal-gradient-prev" : ""}${relative === "next" ? "cal-gradient-next" : ""}`}
                        onMouseOver={e => showAddWorkout(e)} onMouseOut={e => hideAddWorkout(e)}>
                        <span className={`${(day.format('dd') === "Su" || day.format('dd') === "Sa") ? 'text-danger' : ""}`}>{day.format("Do")}</span>
                        <div className="add-workout-button">
                            <NavLink to={`/betterathletes/add_new_workout/?day=${day.format("D")}?month=${day.format("M")}?year=${day.format("YYYY")}`} className=""></NavLink>
                        </div>
                        {workouts && <>
                            {workouts.map((x, i) => (
                                <div key={i}>
                                    {day.format('YYYY-MM-DD') === x.workout_date &&
                                        <NavLink to={`/betterathletes/view_workout/${x.workout_id}`} className="red-shadow">
                                            <div id={x.workout_id} className="ml-3 display-7">- {x.workout_name}</div>
                                        </NavLink>
                                    }
                                </div>
                            ))
                            }
                        </>}
                    </Col>
                ))}
            </>
        </Row>
    )
}

export default DisplayWeek
