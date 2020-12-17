import React from 'react'
import { NavLink } from "react-router-dom";
import { Col, Row, Container, Button } from "react-bootstrap";

function LoggedInLanding({ user_id }) {
    return (
        <>
            <Container className="text-center page-center">
                <Row className="bg-contrast">
                    <Col md={12} className="my-4">
                        <h6 className="display-1">Ready to train today?</h6>
                    </Col>
                    <Col md={6} className="my-4">
                        <NavLink to="/betterathletes/dashboard" style={{ textDecoration: 'none' }}>
                            <Button variant="main" size="lg" block>Dashboard</Button>
                        </NavLink>
                    </Col>

                    <Col md={6} className="my-4">
                        <NavLink to={`/betterathletes/calendar/${user_id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="main" size="lg" block>Calendar</Button>
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default LoggedInLanding
