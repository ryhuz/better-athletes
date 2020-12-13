import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import axios from "axios";

function Register() {
    const [user, setUser] = useState({});
    const [club, setClub] = useState();

    useEffect(() => {
      getClub();
    }, [])

    function handleChange(e) {
      setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
    }

    async function getClub(){
      try {
        let resp = await axios.get("http://localhost:8000/api/clubs");
        setClub(resp.data);
        } catch (error) {
        console.log(error);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
        console.log(user);
        let resp = await axios.post("http://localhost:8000/api/signup/",user);
        console.log(resp)
        // setIsAuth(true);
        } catch (error) {
        console.log(error);
        }    
    }

  return (
    <div className="d-flex align-items-center">
      <Container className="text-center">
        <Col>
          <h3>Better Athletes</h3>
          <Form onSubmit={handleSubmit}>
            <div>User Registration</div>
            <Form.Row className="mb-3">
            <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="username"
                onChange={handleChange}
                name="username"
              />
            </Form.Row>
            <Form.Row className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="email"
                onChange={handleChange}
                name="email"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                placeholder="password"
                name="password"
                type="password"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="dob"
                type="date"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Location</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="location"
                placeholder="location"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Contact Number</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="phone"
                placeholder="phone"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Height</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="height"
                placeholder="height"
                type="number"
              />
            </Form.Row>
            <Form.Row className="mb-3">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                onChange={handleChange}
                name="weight"
                placeholder="weight"
                type="number"
              />
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Gender</Form.Label>
                <Form.Control onChange={handleChange} name="gender" as="select">
                  <option>Select One</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="P">Prefer not to say</option>
                  </Form.Control>
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Club</Form.Label>
              <Form.Control onChange={handleChange} name="club" as="select">
                <option>Select One</option>
                {club && club.map(el=>(
                  <option key={el.id} value={el.id}>{el.club_name}</option>
                ))}
              </Form.Control>
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label>Do you wish to make your workouts public?</Form.Label>
                <Form.Control onChange={handleChange} name="public_workouts" as="select">
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
          <NavLink to="/login">Login</NavLink>
        </Col>
      </Container>
    </div>
  );
}

export default Register
