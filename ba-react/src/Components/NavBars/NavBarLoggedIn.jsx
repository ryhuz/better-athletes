import React from 'react'
import { NavLink } from "react-router-dom";
import { Navbar, Button, Form, Nav, NavDropdown } from "react-bootstrap";

function NavBarLoggedIn({ username, user_id }) {
    return (
        <>
            <Navbar className="navbar" expand="lg">
                <Navbar.Brand href="/" className="mx-3"><span className="title red-shadow h5">BETTER ATHLETES</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <ul className="navbar-nav ml-auto mr-3">
                        <div className="h6 mx-4">
                            Logged in as: <NavLink to={`/profile/${user_id}`} className="red-shadow">{username}</NavLink>
                        </div>
                        <div className="h6 mx-4">
                            <NavLink to='/logout' classname="btn btn-outline-secondary alert">
                                Logout
                            </NavLink>
                        </div>
                    </ul>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBarLoggedIn
