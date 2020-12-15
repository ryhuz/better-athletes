import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import { axiosInstance } from '../../../func/axiosApi'

function AthleteProfile() {
    let { id } = useParams()
    const [profile, setProfile] = useState({
        found: false,
        valid: false,
        profile: {}
    })

    useEffect(() => {
        async function getProfile() {
            try {
                let temp = await axiosInstance(`profile/${id}`)
                console.log(temp.data)
                setProfile(temp.data)
            } catch (e) {
                setProfile(e.response.data)
            }
        }
        getProfile()
    }, [])

    return (
        <Container className="p-5">
            {profile.found ?
                <>
                    {profile.valid ?
                        <div className="bg-contrast p-4">
                            <h1 className="mb-3 display-4 title">{profile.profile.name.trim() ? profile.profile.name : profile.profile.username}</h1>
                            <div className="my-3">
                                <Row>
                                    <Col>
                                        <div className="my-2"><u>Club</u></div>
                                        <div className="bigger-text ml-3">{profile.profile.club}</div>
                                        <div className="my-2"><u>Gender</u></div>
                                        <div className="bigger-text ml-3">{profile.profile.gender}</div>
                                        <div className="my-2"><u>Age</u></div>
                                        <div className="bigger-text ml-3">{profile.profile.age}</div>
                                        <div className="my-2"><u>Location</u></div>
                                        <div className="bigger-text ml-3">{profile.profile.location}</div>
                                    </Col>
                                    <Col>
                                        Photo
                                </Col>
                                </Row>
                                <hr className="my-5 border" />
                                <Row className="my-3">
                                    <Col>
                                        <div className="display-5 mb-5">Recent Workouts</div>
                                        {profile.profile.public ?
                                            profile.profile.recent_workouts.length ?
                                                <>
                                                    {profile.profile.recent_workouts.map((wkout, index) => (
                                                        <div key={index}>
                                                            <h5>{wkout.workout_date}</h5>
                                                            <div>
                                                                {wkout.workout_name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </> :
                                                <>
                                                    No recent workouts
                                        </> :
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
