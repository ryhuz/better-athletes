import { NavLink } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import React, {useState} from 'react';
import jwt_decode from 'jwt-decode';
import InnerNaviBar from "../../InnerNaviBar";
import {axiosInstance} from "../../../func/axiosApi"

function Login() {
  const [user, setUser] = useState({});

  function handleChange(e) {
    setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e){
    e.preventDefault();
    try {
      let resp = await axiosInstance.post("login",{username: user.username, password: user.password});
      axiosInstance.defaults.headers['Authorization'] = "JWT " + resp.data.access;
      localStorage.setItem("token", resp.data.access);
      // setIsAuth(true);
    } catch (error) {
      console.log(error);
    }    
  }

  // Logout button that removes token
  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("is_coach");
    axiosInstance.defaults.headers['Authorization'] = null;
  }

  // Test function to test token and authorization. Remove when done.
  async function test(){
    try {
      let resp = await axiosInstance.get("workouts");
      console.log(resp)
      // setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function test2(){
    try {
      let resp = await axiosInstance.post("token/verify", {
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("is_coach");
      axiosInstance.defaults.headers['Authorization'] = null;
      // setIsAuth(false);
      console.log(error);
    }
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
          {/* Logout button */}
          <Form.Row className="mb-3">
          <Button onClick={logout} block>
                Logout
          </Button>
          </Form.Row>
          <Button onClick={test} block>
                {/* For you to test the GET function to get workouts list */}
                Test
          </Button>
          <Button onClick={test2} block>
                {/* For you to test the GET function to get workouts list */}
                Test2
          </Button>
          <NavLink to="/register">Sign Up Now </NavLink>
        </Col>
      </Container>
    </div>
  );
}

export default Login
