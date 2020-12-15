import React from 'react'
import { Col, Row } from 'react-bootstrap'

function DisplayWeek({ week, relative }) {
    return (
        <Row>
            {week.map(day => (
                <Col key={day} className="border overflow-auto wkout-day">
                    <span className={`${(day.format('dd')==="Su" || day.format('dd')==="Sa") && 'text-danger'}`}>{day.format("Do")}</span>
                </Col>
            ))}
        </Row>
    )
}

export default DisplayWeek
