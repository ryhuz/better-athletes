import React, { useEffect, useState } from 'react'
import { NavLink, Redirect } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import { axiosInstance } from "../../../func/axiosApi"
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as Yup from "yup";
import { useFormik } from "formik";

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

  let Schema = Yup.object().shape({
    firstname: Yup.string()
      .required("Required")
      .min(1, "Specified field is too short")
      .max(70, "Specified field is too long"),
    lastname: Yup.string()
      .min(1, "Specified field is too short")
      .max(70, "Specified field is too long")
      .required("Required"),

    username: Yup.string()
      .min(2, "Specified field is too short")
      .max(70, "Specified field is too long")
      .required("Required"),

    email: Yup.string().email("Invalid email").required("Required"),

    password: Yup.string()
      .label("Password")
      .required("Required")
      .min(2, "Password is too short"),

    password2: Yup.string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),

    dob: Yup.date()
      .required('Date of birth is required'),

    gender: Yup.string()
    .required('Gender is required'),

    location: Yup.string()
    .required('Gender is required')
    .min(1, "Specified field is too short")
    .max(50, "Specified field is too long"),

    phone: Yup.string()
      .required('Phone number is required'),

    height: Yup.number()
      .require('Height is required'),

    weight: Yup.number()
      .require('Height is required'),
      
  });

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
  } = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      password2: "",
      dob: "",
      gender: "",
      location: "",
      phone: "",
      height: "",
      weight: "",
      club: "",
      public_workouts: "",
      is_coach: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      console.log(values);
      // submit(values);
    },
  });

  //submits and sends user creation request to Django
  async function submit(user) {
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

  if (isAuth.valid) {
    return <Redirect to="betterathletes/dashboard" />
  }

  return (
    <div className="d-flex align-items-center landing full-height">
      <Container className="text-center bg-contrast px-5 py-2">
        <div className="my-4">
          <h2>Better Athletes</h2>
          <h4>User Registration</h4>
        </div>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Row className="my-4 text-left">
              {/* Username Input */}
              <Col className="mx-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="username"
                />
              </Col>
              {/* Email Input */}
              <Col className="mx-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="email"
                />
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              <Col className="mx-3">
                {/* Password Input */}
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  placeholder="type password"
                  name="password"
                  type="password"
                />
              </Col>
              <Col className="mx-3">
                {/* Password Confirmation */}
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  placeholder="type password again"
                  name="password2"
                  type="password"
                />
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              {/* Username Input */}
              <Col className="mx-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="first_name"
                />
              </Col>
              {/* Email Input */}
              <Col className="mx-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="last_name"
                />
              </Col>
              {/* Date of Birth Input */}
              <Col className="mx-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="dob"
                  type="date"
                />
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              <Col className="mx-3">
                {/* Gender Selection */}
                <Form.Label>Gender</Form.Label>
                <Form.Control onChange={handleChange} name="gender" as="select">
                  <option>Select One</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="P">Prefer not to say</option>
                </Form.Control>
              </Col>
              <Col className="mx-3">
                {/* Location Input */}
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="location"
                  placeholder="location"
                />
              </Col>
              <Col className="mx-3">
                {/* Contact Input */}
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="phone"
                  placeholder="phone"
                />
              </Col>
            </Form.Row>
            <Form.Row className="my-4">
              {/* Club Selection */}
              <Col className="mx-3">
                <Form.Label>Club</Form.Label>
                <Form.Control onChange={handleChange} name="club" as="select">
                  <option>Select One</option>
                  {club && club.map(el => (
                    <option key={`key${el.id}`} value={el.id}>{el.club_name}</option>
                  ))}
                </Form.Control>
              </Col>
              <Col className="mx-3">
                {/* Height Input */}
                <Form.Label>Height</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="height"
                  placeholder="height"
                  type="number"
                />
              </Col>
              <Col className="mx-3">
                {/* Weight Input */}
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="weight"
                  placeholder="weight"
                  type="number"
                />
              </Col>
            </Form.Row>
            <Form.Row className="my-4">
              {/* Public Workout Selection */}
              <Col className="mx-3">
                <Form.Label>Do you wish to make your workouts public?</Form.Label>
                <Form.Control onChange={handleChange} name="public_workouts" as="select">
                  <option>Select One</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Control>
              </Col>
              {/* Is Coach Selection */}
              <Col className="mx-3">
                <Form.Label>Are you a coach?</Form.Label>
                <Form.Control onChange={handleChange} name="is_coach" as="select">
                  <option>Select One</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Control>
              </Col>
            </Form.Row>
            <Form.Row className="mt-4 mx-3">
              <Button type="submit" variant="main" block>
                Register
              </Button>
            </Form.Row>
            <div className="text-right px-4">Have an account?<NavLink to="/login"> Login</NavLink></div>
          </Form>
          {/* Re-route to Login Page */}
        </Col>
      </Container>
    </div>
  );
}

export default Register
