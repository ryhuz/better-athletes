import React, { useEffect, useState } from 'react'
import { NavLink, Redirect } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import { axiosInstance } from "../../../func/axiosApi"
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function Register({ isAuth, setAuth }) {
  const [user, setUser] = useState({});
  const [club, setClub] = useState();

  useEffect(() => {

    // getting club details for user creation
    async function getClub() {
      try {
        let resp = await axios.get("http://localhost:8000/api/clubs");
        setClub(resp.data);
      } catch (error) {
        console.log(error);
      }
    }
    getClub();
  }, [])

  function handleChange(e) {
    setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
  }

  //submits and sends user creation request to Django
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(user);
      await axios.post("http://localhost:8000/api/signup", user);
      try {
        let resp = await axiosInstance.post("login", { username: user.username, password: user.password });
        axiosInstance.defaults.headers['Authorization'] = "JWT " + resp.data.access;
        localStorage.setItem("token", resp.data.access);
        let decoded = jwt_decode(resp.data.access);
        return setAuth({
          valid: true,
          refreshed: false,
          coach: decoded.is_coach,
          user: decoded.username
        });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isAuth.valid){
    return <Redirect to="betterathletes/dashboard"/>
  }

  return (
    <div className="d-flex align-items-center">
      <Container className="text-center">
        <Col>
          <h3>Better Athletes</h3>
          <Form onSubmit={handleSubmit}>
            <div>User Registration</div>
            {/* Username Input */}
            <Form.Row className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="username"
                onChange={handleChange}
                name="username"
              />
            </Form.Row>
            {/* Email Input */}
            <Form.Row className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="email"
                onChange={handleChange}
                name="email"
              />
            </Form.Row>
            <Form.Row className="mb-3">
              {/* Password Input */}
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                placeholder="password"
                name="password"
                type="password"
              />
            </Form.Row>
            {/* Date of Birth Input */}
            <Form.Row className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="dob"
                type="date"
              />
            </Form.Row>
            {/* Location Input */}
            <Form.Row className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="location"
                placeholder="location"
              />
            </Form.Row>
            {/* Contact Input */}
            <Form.Row className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="phone"
                placeholder="phone"
              />
            </Form.Row>
            {/* Height Input */}
            <Form.Row className="mb-3">
              <Form.Label>Height</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="height"
                placeholder="height"
                type="number"
              />
            </Form.Row>
            {/* Weight Input */}
            <Form.Row className="mb-3">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="weight"
                placeholder="weight"
                type="number"
              />
            </Form.Row>
            {/* Gender Selection */}
            <Form.Row className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control onChange={handleChange} name="gender" as="select">
                <option>Select One</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="P">Prefer not to say</option>
              </Form.Control>
            </Form.Row>
            {/* Club Selection */}
            <Form.Row className="mb-3">
              <Form.Label>Club</Form.Label>
              <Form.Control onChange={handleChange} name="club" as="select">
                <option>Select One</option>
                {club && club.map(el => (
                  <option key={`key${el.id}`} value={el.id}>{el.club_name}</option>
                ))}
              </Form.Control>
            </Form.Row>
            {/* Public Workout Selection */}
            <Form.Row className="mb-3">
              <Form.Label>Do you wish to make your workouts public?</Form.Label>
              <Form.Control onChange={handleChange} name="public_workouts" as="select">
                <option>Select One</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Control>
            </Form.Row>
            {/* Is Coach Selection */}
            <Form.Row className="mb-3">
              <Form.Label>Are you a coach?</Form.Label>
              <Form.Control onChange={handleChange} name="is_coach" as="select">
                <option>Select One</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Control>
            </Form.Row>
            <Form.Row className="mb-3">
              <Button type="submit" block>
                Register
              </Button>
            </Form.Row>
          </Form>
          {/* Re-route to Login Page */}
          <NavLink to="/login">Login</NavLink>
        </Col>
      </Container>
    </div>
  );
}

export default Register
