import React from 'react'
import { NavLink } from "react-router-dom";
import { Col, Row, Container, Button } from "react-bootstrap";

function LandingPage() {
    return (
        <>
            <Container className="text-center page-center">
                <Row className="bg-contrast">
                    <Col md={12} className="my-4">
                        <h6 className="display-1 title">Better Athletes</h6>
                    </Col>
                    <Col md={12} className="my-4">
                        <h6 className="display-4 red-shadow">Join Us Today</h6>
                    </Col>
                    <Col md={6} className="my-4 px-5">
                        <NavLink to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant="main" size="lg" block>Login</Button>
                        </NavLink>
                    </Col>
                    <Col md={6} className="my-4 px-5">
                        <NavLink to="/register" style={{ textDecoration: 'none' }}>
                            <Button variant="main" size="lg" block>Register</Button>
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default LandingPage
