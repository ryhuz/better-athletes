import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'react-bootstrap'
import { axiosInstance } from '../../../func/axiosApi'
import jwt_decode from 'jwt-decode';
import EditProfile from './EditProfile';

function AthleteProfile() {
    let { id } = useParams()
    let token = localStorage.getItem("token");
    const [profile, setProfile] = useState({
        found: false,
        valid: false,
        profile: {}
    })
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            let temp = await axiosInstance(`profile/${id}`)
            console.log(temp.data)
            setProfile(temp.data)
        } catch (e) {
            setProfile(e.response.data)
        }
    }

    return (
        <div className="p-5">
            {profile.found ?
                <>
                    {profile.valid ?
                        <>
                            <div className="my-3">
                            {!edit?
                            <>
                                <h1 className="mb-3 display-4">{profile.profile.name.trim() ? profile.profile.name: profile.profile.username }</h1>
                                <Row>
                                    <Col>
                                        <div className="h5 my-2"><u>Club</u></div>
                                        <div>{profile.profile.club}</div>
                                        <div className="h5 my-2"><u>Gender</u></div>
                                        <div>{profile.profile.gender=="F"?"Female":profile.profile.gender=="M"?"Male":"Prefer not to Say"}</div>
                                        <div className="h5 my-2"><u>Age</u></div>
                                        <div>{profile.profile.age}</div>
                                        <div className="h5 my-2"><u>Location</u></div>
                                        <div>{profile.profile.location}</div>
                                    </Col>
                                    <Col>
                                        Photo
                                    </Col>
                                </Row>
                                <Row className="justify-content-center">
                                    {id == jwt_decode(token).user_id &&
                                    <Button onClick={()=>{setEdit(!edit)}}>
                                        Edit Profile
                                    </Button>
                                    }
                                </Row>
                                </>
                                : <EditProfile getProfile={getProfile} id={id} edit={edit} setEdit={setEdit} profile={profile} />}
                                <hr className="my-4"/>
                                <Row className="my-3">
                                    <Col>
                                        <h3 className="display-4 mb-5">Recent Workouts</h3>
                                        {profile.profile.public ?
                                        <>
                                            {profile.profile.recent_workouts.map(wkout=>(
                                                <>
                                                <h5>{wkout.workout_date}</h5>
                                                <div>
                                                    {wkout.workout_name}
                                                </div>
                                                </>
                                            ))}
                                        </>:
                                        <>
                                            Workouts have been set to private
                                        </>
                                    }
                                    </Col>
                                    <Col className="d-flex align-items-center">
                                        <div>
                                            <div>
                                                View workout calendar
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </> :
                        <>
                            <h1 className="my-3 display-4">Oops, no such user</h1>
                        </>
                    }
                </> :
                <>
                    <h1 className="my-3 display-4">Loading...</h1>
                </>
            }
        </div>
    )
}



export default AthleteProfile
