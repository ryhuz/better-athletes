import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { axiosInstance } from '../../../func/axiosApi'
import jwt_decode from 'jwt-decode';
import EditProfile from './EditProfile';

function AthleteProfile() {
    let { id } = useParams()
    let token = localStorage.getItem("token");
    let decoded = jwt_decode(token);
    let is_coach = false;

    if (decoded.is_coach) {
        is_coach = decoded.is_coach;
    }

    const [profile, setProfile] = useState({
        found: false,
        valid: false,
        profile: {}
    })
    const [edit, setEdit] = useState(false);
    const [track, setTrack] = useState({
        found: false,
    })

    useEffect(() => {
        setEdit(false);
        getProfile();
        if (is_coach) {
            getTrack();
        }
    }, [])

    async function getProfile() {
        try {
            let temp = await axiosInstance.get(`profile/${id}`)
            setProfile(temp.data)
        } catch (e) {
            setProfile(e.response.data)
        }
    }

    async function getTrack() {
        try {
            let temp = await axiosInstance.get(`track/${id}`)
            setTrack(temp.data);
        } catch (e) {
            console.log(e.response.data);
        }
    }

    async function submitTrack() {
        try {
            let temp = await axiosInstance.post(`track/${id}`)
            setTrack(temp.data)
        } catch (e) {
            console.log(e.response.data)
        }
    }
    
    return (
        <Container className="p-5">
            {profile.found ?
                <>
                    {profile.valid ?
                        <div className="bg-contrast p-4">
                            {!edit ?
                                <>
                                    <h1 className="title mb-3 display-4">{profile.profile.name.trim() ? profile.profile.name : profile.profile.username}</h1>
                                    <div className="my-3">
                                        <Row>
                                            <Col>
                                                <div className="my-2"><u>Club</u></div>
                                                <div className="bigger-text ml-3">{profile.profile.club}</div>
                                                <div className="my-2"><u>Gender</u></div>
                                                <div className="bigger-text ml-3">{profile.profile.gender === "F" ? "Female" : profile.profile.gender === "M" ? "Male" : "Prefer not to Say"}</div>
                                                <div className="my-2"><u>Age</u></div>
                                                <div className="bigger-text ml-3">{profile.profile.age}</div>
                                                <div className="my-2"><u>Location</u></div>
                                                <div className="bigger-text ml-3">{profile.profile.location}</div>
                                            </Col>
                                            <Col>
                                                <Row className="justify-content-center" xs={1}>
                                                    {parseInt(id) === parseInt(jwt_decode(token).user_id) &&
                                                        <Col className="my-5">
                                                            <Button onClick={() => { setEdit(!edit) }} variant="main" block>
                                                                Edit Profile
                                                            </Button>
                                                        </Col>
                                                    }
                                                    {(track.found || profile.profile.public || parseInt(id) === parseInt(jwt_decode(token).user_id)) && !profile.profile.is_coach &&
                                                        <Col className="my-5">
                                                            <NavLink to={`/betterathletes/calendar/${id}`} >
                                                                <Button variant="main" block>
                                                                    Workout Calendar
                                        </Button>
                                                            </NavLink>
                                                        </Col>
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                                : <EditProfile getProfile={getProfile} id={id} edit={edit} setEdit={setEdit} profile={profile} />}
                            <Row className="justify-content-center">
                                {jwt_decode(token).is_coach && !profile.profile.is_coach && jwt_decode(token).club === profile.profile.club && !track.found && parseInt(id) !== parseInt(jwt_decode(token).user_id) &&
                                    <Button onClick={submitTrack} variant="main" block>
                                        Track Athlete
                                    </Button>
                                }
                                {jwt_decode(token).is_coach && !profile.profile.is_coach && jwt_decode(token).club === profile.profile.club && track.found && parseInt(id) !== parseInt(jwt_decode(token).user_id) &&
                                    <Button onClick={submitTrack} variant="outline-danger" block>
                                        Untrack Athlete
                                    </Button>
                                }
                            </Row>
                            <hr className="my-5 border" />
                            <Row className="my-3">
                                <Col>
                                    <div className="display-5 mb-5">Recent Workouts</div>
                                    {profile.profile.public || parseInt(id) === parseInt(jwt_decode(token).user_id) ?
                                        profile.profile.recent_workouts.length ?
                                            <div className="my-4">
                                                {profile.profile.recent_workouts.map((wkout, index) => (
                                                    <NavLink to={`/betterathletes/view_workout/${wkout.workout_id}`} className="red-shadow" key={index}>
                                                        <div key={index} className="my-4">
                                                            <h6>{wkout.workout_date}</h6>
                                                            <div className="bigger-text2">
                                                                {wkout.workout_name}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                ))}
                                            </div> :
                                            <>
                                                No recent workouts
                                        </> :
                                        <>
                                            Workouts have been set to private
                                        </>
                                    }
                                </Col>
                                <Col className="d-flex align-items-center">

                                </Col>
                            </Row>
                        </div> :
                        <>
                            <h1 className="my-3 display-4">Oops, no such user</h1>
                        </>
                    }
                </> :
                <>
                    <h1 className="my-3 display-4">Loading...</h1>
                </>
            }
        </Container>
    )
}



export default AthleteProfile
