import { NavLink, Redirect } from "react-router-dom";
import { Col, Form, Container, Button, Row } from "react-bootstrap";
import React, { useState } from 'react';
import { axiosInstance } from "../../../func/axiosApi"
import jwt_decode from 'jwt-decode';

function Login({ isAuth, setAuth }) {
  const [user, setUser] = useState({});
  const [loginErr, setLoginErr] = useState(false)
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
      setLoginErr(true)
    }
  }

  if (isAuth.valid) {
    return <Redirect to="/betterathletes/dashboard" />
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col md={6}>
          <div className="text-center">
            <h3>Better Athletes</h3>
            <div>User Login</div>
          </div>
          <Form onSubmit={handleSubmit}>
            {loginErr &&
              <Form.Label className="text-danger h6">Username or password incorrect</Form.Label>
            }
            {/* Username Input */}
            <Form.Row>
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="username"
              />
            </Form.Row>
            {/* Password Input */}
            <Form.Row className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
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
      </Row>
    </Container>
  );
}

export default Login
