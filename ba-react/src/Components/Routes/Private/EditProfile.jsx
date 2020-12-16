import React from 'react'
import { useState, useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { axiosInstance } from '../../../func/axiosApi';

function EditProfile({getProfile, id, edit, setEdit, profile}) {
    const [userprofile, setUserProfile] = useState()
    const [club, setClub] = useState();

    useEffect(() => {

        // getting club details for user creation
        async function getClub() {
          try {
            let resp = await axiosInstance.get("clubs");
            setClub(resp.data);
          } catch (error) {
            console.log(error);
          }
        }
        getClub();
      }, [])
    
    function changeHandler(e) {
        setUserProfile((user) => ({ ...user, [e.target.name]: e.target.value }));
      }

    async function submit(){
        try {
            console.log(userprofile);
            let resp = await axiosInstance.put(`profile/${id}`, userprofile);
            setEdit(!edit);
            getProfile();
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>
            <Form>
            <h1 className="mb-3 display-4">{profile.profile.name.trim() ? profile.profile.name: profile.profile.username }</h1>
            <Row>
                <Col>
                    <Form.Row>
                    <Form.Label>Edit Club</Form.Label>
                    <Form.Control 
                        as="select"
                        onChange={changeHandler}
                        name="club">
                        <option>Select One</option>
                        {club && club.map(el => (
                        <option key={`key${el.id}`} value={el.id}>{el.club_name}</option>
                        ))}
                    </Form.Control>
                    </Form.Row>
                    <Form.Row>
                    <Form.Label>Edit Gender</Form.Label>
                    <Form.Control onChange={changeHandler} name="gender" as="select">
                        <option>Select One</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="P">Prefer not to say</option>
                    </Form.Control>
                    </Form.Row>
                    <Form.Row className="mb-3">
                    <Form.Label>Edit Date of Birth</Form.Label>
                    <Form.Control
                        onChange={changeHandler}
                        name="dob"
                        type="date"
                    />
                    </Form.Row>
                    <Form.Row className="mb-3">
                    <Form.Label>Edit Location</Form.Label>
                    <Form.Control
                        onChange={changeHandler}
                        name="location"
                        type="text"
                    />
                    </Form.Row>
                    <Form.Row>
                    <Form.Label>Do you want to make your Workout Public?</Form.Label>
                    <Form.Control onChange={changeHandler} name="public_workouts" as="select">
                        <option>Select One</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </Form.Control>
                    </Form.Row>
                </Col>
                <Col>
                    Photo
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Button onClick={submit}>
                    Save Profile
                </Button>
            </Row>
            </Form>
        </div>
    )
}

export default EditProfile
