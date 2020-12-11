import React, { Fragment }from 'react'
import { NavLink } from "react-router-dom";
import { Navbar, Col, Row, Form, Nav, Container, Button } from "react-bootstrap";

function Home() {
    return (
        <Fragment>
                   <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">BETTER ATHLETES</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">

                </Nav>
                <Form inline>
                    <div class="px-3">
                        <NavLink to="/ranking" style={{ textDecoration: 'none' }} className="text-secondary">RANKING</NavLink>
                    </div>
                    <div class="px-3">
                        <NavLink to="/features" style={{ textDecoration: 'none' }} className="text-secondary">FEATURES</NavLink>
                    </div>
                    <div class="px-3">
                        <NavLink to="/about" style={{ textDecoration: 'none' }} className="text-secondary">ABOUT</NavLink>
                    </div>
                </Form>
            </Navbar.Collapse>
            </Navbar>
                <Container className="mt-5">
                    <Row>
                        <Col md={12} className="my-4">
                            <h6 className="display-1">Better Athletes</h6>
                        </Col>
                        <Col md={12} className="my-4">
                            <h6 className="display-4">Join Us Today</h6>
                        </Col>
                        <Col md={6} className="my-4">
                            <NavLink to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="outline-primary" size="lg" block>Login</Button>
                            </NavLink>
                        </Col>
                            
                        <Col md={6} className="my-4">
                            <NavLink to="/register" style={{ textDecoration: 'none' }}>
                                <Button variant="outline-secondary" size="lg" block> Register</Button>
                            </NavLink>
                        </Col>
                    </Row>
                 </Container>
        </Fragment>
    )
}

export default Home
