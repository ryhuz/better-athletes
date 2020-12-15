import React from 'react'
import { NavLink } from "react-router-dom";
import { Navbar, Button, Form, Nav } from "react-bootstrap";

function NavBarNotLoggedIn() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">BETTER ATHLETES</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">

                </Nav>
                <Form inline>
                    <div className="px-3">
                        <NavLink to="/ranking" style={{ textDecoration: 'none' }} className="text-secondary">RANKING</NavLink>
                    </div>
                    <div className="px-3">
                        <NavLink to="/features" style={{ textDecoration: 'none' }} className="text-secondary">FEATURES</NavLink>
                    </div>
                    <div className="px-3">
                        <NavLink to="/about" style={{ textDecoration: 'none' }} className="text-secondary">ABOUT</NavLink>
                    </div>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBarNotLoggedIn
