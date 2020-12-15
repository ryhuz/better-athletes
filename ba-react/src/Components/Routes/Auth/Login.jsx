import { NavLink, Redirect } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import React, { useState } from 'react';
import { axiosInstance } from "../../../func/axiosApi"
import jwt_decode from 'jwt-decode';

function Login({ isAuth, setAuth }) {
  const [user, setUser] = useState({});
  function handleChange(e) {
    setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let resp = await axiosInstance.post("login", { username: user.username, password: user.password });
      if (resp) {
        axiosInstance.defaults.headers['Authorization'] = "JWT " + resp.data.access;
        localStorage.setItem("token", resp.data.access);
        let decoded = jwt_decode(resp.data.access);
        setAuth({
          valid: true,
          load: true,
          coach: decoded.is_coach,
          user: decoded.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isAuth.valid) {
    return <Redirect to="/betterathletes/dashboard" />
  }

  return (
    <div className="d-flex align-items-center">
      <Container className="text-center">
        <Col>
          <h3>Better Athletes</h3>
          <Form onSubmit={handleSubmit}>
            <div>User Login</div>
            {/* Username Input */}
            <Form.Row>
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="username"
                onChange={handleChange}
                name="username"
              />
            </Form.Row>
            {/* Password Input */}
            <Form.Row className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                placeholder="password"
                name="password"
                type="password"
              />
            </Form.Row>
            {/* Login button */}
            <Form.Row className="mb-3">
              <Button type="submit" block>
                Login
              </Button>
            </Form.Row>
          </Form>
          <NavLink to="/register">Sign Up Now </NavLink>
        </Col>
      </Container>
    </div>
  );
}

export default Login
