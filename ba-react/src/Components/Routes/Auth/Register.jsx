import React, { useEffect, useState } from 'react'
import { NavLink, Redirect } from "react-router-dom";
import { Col, Form, Container, Button } from "react-bootstrap";
import { axiosInstance } from "../../../func/axiosApi"
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as Yup from "yup";
import { useFormik } from "formik";

function Register({ isAuth, setAuth }) {
  const [clubErr, setClubErr] = useState(false);
  const [club, setClub] = useState();
  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
  useEffect(() => {

    // getting club details for user creation
    async function getClub() {
      try {
        let resp = await axios.get("http://localhost:8000/api/clubs");
        setClub(resp.data);
      } catch (error) {
        setClubErr(true)
      }
    }
    getClub();
  }, [])

  const Schema = Yup.object().shape({
    first_name: Yup.string()
      .required("Required")
      .min(2, "Specified field is too short")
      .max(70, "Specified field is too long"),

    last_name: Yup.string()
      .min(2, "Specified field is too short")
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
      .min(8, "Password must be more than 7 characters"),

    password2: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),

    dob: Yup.date()
      .required('Date of birth is required'),

    gender: Yup.string()
      .test('empty-check', 'Gender cannot be empty', value => (value === "M" || value === "F" || value === "P"))
      .required('Gender is required'),

    location: Yup.string()
      .required('Location is required')
      .min(2, "Specified field is too short")
      .max(50, "Specified field is too long"),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegExp, 'Phone number is not valid'),

    height: Yup.number().integer()
      .required('Height is required'),

    weight: Yup.number().integer()
      .required('Weight is required'),

    club: Yup.string()
      .required('Club is required')
      .test('empty-check', 'Club cannot be empty', value => value !== " "),

    public_workouts: Yup.string()
      .required('Please confirm your profile privacy setting')
      .test('empty-check', 'Please confirm your profile privacy setting', value => value !== " "),

    is_coach: Yup.string()
      .required('Please confirm whether you are a coach')
      .test('empty-check', 'Please confirm whether you are a coach', value => value !== " "),
  });

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
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
      club: " ",
      public_workouts: "",
      is_coach: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      submit(values);
    },
  });

  //submits and sends user creation request to Django
  async function submit(user) {
    try {
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
      alert('Oh no! Something went wrong! Try to change your username');
    }
  }

  if (isAuth.valid) {
    return <Redirect to="betterathletes/dashboard" />
  }

  return (
    <div className="d-flex align-items-center landing full-height">
      <Container className="text-center bg-contrast px-5 py-2">
        {clubErr && <div className="text-danger text-left">Error fetching club data!</div>}
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
                  values={values.username}
                  className={
                    touched.username && errors.username ? `is-invalid` : null
                  }
                />
                {touched.username && errors.username ? (
                  <div className="invalid-feedback">{errors.username}</div>
                ) : null}
              </Col>
              {/* Email Input */}
              <Col className="mx-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="email"
                  values={values.email}
                  className={
                    touched.email && errors.email ? `is-invalid` : null
                  }
                />
                {touched.email && errors.email ? (
                  <div className="invalid-feedback">{errors.email}</div>
                ) : null}
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
                  values={values.password}
                  className={
                    touched.password && errors.password ? `is-invalid` : null
                  }
                />
                {touched.password && errors.password ? (
                  <div className="invalid-feedback">{errors.password}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                {/* Password Confirmation */}
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  placeholder="type password again"
                  name="password2"
                  type="password"
                  values={values.password2}
                  className={
                    touched.password2 && errors.password2 ? `is-invalid` : null
                  }
                />
                {touched.password2 && errors.password2 ? (
                  <div className="invalid-feedback">{errors.password2}</div>
                ) : null}
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              <Col className="mx-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="first_name"
                  values={values.first_name}
                  className={
                    touched.first_name && errors.first_name ? `is-invalid` : null
                  }
                />
                {touched.first_name && errors.first_name ? (
                  <div className="invalid-feedback">{errors.first_name}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="last_name"
                  values={values.last_name}
                  className={
                    touched.last_name && errors.last_name ? `is-invalid` : null
                  }
                />
                {touched.last_name && errors.last_name ? (
                  <div className="invalid-feedback">{errors.last_name}</div>
                ) : null}
              </Col>
              {/* Date of Birth Input */}
              <Col className="mx-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="dob"
                  type="date"
                  values={values.dob}
                  className={
                    touched.dob && errors.dob ? `is-invalid` : null
                  }
                />
                {touched.dob && errors.dob ? (
                  <div className="invalid-feedback">{errors.dob}</div>
                ) : null}
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              <Col className="mx-3">
                {/* Gender Selection */}
                <Form.Label>Gender</Form.Label>
                <Form.Control onChange={handleChange} name="gender" as="select" className={touched.gender && errors.gender ? `is-invalid` : null}>
                  <option value=" ">Select One</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="P">Prefer not to say</option>
                </Form.Control>
                {touched.gender && errors.gender ? (
                  <div className="invalid-feedback">{errors.gender}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                {/* Location Input */}
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="location"
                  placeholder="location"
                  values={values.location}
                  className={
                    touched.location && errors.location ? `is-invalid` : null
                  }
                />
                {touched.location && errors.location ? (
                  <div className="invalid-feedback">{errors.location}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                {/* Contact Input */}
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="phone"
                  placeholder="phone"
                  values={values.phone}
                  className={
                    touched.phone && errors.phone ? `is-invalid` : null
                  }
                />
                {touched.phone && errors.phone ? (
                  <div className="invalid-feedback">{errors.phone}</div>
                ) : null}
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              {/* Club Selection */}
              <Col className="mx-3">
                <Form.Label>Club</Form.Label>
                <Form.Control onChange={handleChange} name="club" as="select" className={touched.club && errors.club ? `is-invalid` : null}>
                  <option value=" ">Select One</option>
                  {club && club.map(el => (
                    <option key={`key${el.id}`} value={el.id}>{el.club_name}</option>
                  ))}
                </Form.Control>
                {touched.club && errors.club ? (
                  <div className="invalid-feedback">{errors.club}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                {/* Height Input */}
                <Form.Label>Height</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="height"
                  placeholder="height"
                  type="number"
                  values={values.height}
                  className={
                    touched.height && errors.height ? `is-invalid` : null
                  }
                />
                {touched.height && errors.height ? (
                  <div className="invalid-feedback">{errors.height}</div>
                ) : null}
              </Col>
              <Col className="mx-3">
                {/* Weight Input */}
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="weight"
                  placeholder="weight"
                  type="number"
                  values={values.weight}
                  className={
                    touched.weight && errors.weight ? `is-invalid` : null
                  }
                />
                {touched.weight && errors.weight ? (
                  <div className="invalid-feedback">{errors.weight}</div>
                ) : null}
              </Col>
            </Form.Row>
            <Form.Row className="my-4 text-left">
              {/* Public Workout Selection */}
              <Col className="mx-3">
                <Form.Label>Do you wish to make your workouts public?</Form.Label>
                <Form.Control onChange={handleChange} name="public_workouts" as="select" className={touched.public_workouts && errors.public_workouts ? `is-invalid` : null}>
                  <option value=" ">Select One</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Control>
                {touched.public_workouts && errors.public_workouts ? (
                  <div className="invalid-feedback">{errors.public_workouts}</div>
                ) : null}
              </Col>
              {/* Is Coach Selection */}
              <Col className="mx-3 text-left">
                <Form.Label>Are you a coach?</Form.Label>
                <Form.Control onChange={handleChange} name="is_coach" as="select" className={touched.is_coach && errors.is_coach ? `is-invalid` : null}>
                  <option value=" ">Select One</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Control>
                {touched.is_coach && errors.is_coach ? (
                  <div className="invalid-feedback">{errors.is_coach}</div>
                ) : null}
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
