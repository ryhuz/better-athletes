import React from 'react'
import { Col, Row } from 'react-bootstrap'

function DisplayMonth({ mth, days }) {
    return (
        <>
            <Row>
                <Col className="text-center border py-1">
                    <div className="h4">{mth}</div>
                </Col>
            </Row>
            <Row>
                {days.map(day => (
                    <Col key={day} className="border text-center">
                        <div className={`h6 ${(day==="Sunday" || day==="Saturday") && 'text-danger'}`}>{day}</div>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default DisplayMonth
