import React, { useEffect, useState } from 'react'
import { Col, Container, Jumbotron, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { axiosInstance } from '../../../func/axiosApi'

function ViewClub() {
    const [club, setClub] = useState({})

    useEffect(() => {
        async function getClub() {
            try {
                let temp = await axiosInstance(`club`)
                setClub(temp.data)
            } catch (e) {

            }
        }
        getClub()
    }, [])

    return (
        <Container className="mt-5">
            {Object.keys(club).length ?
                <>
                    <Jumbotron className="bg-dark">
                        <h2 className="display-4">{club.club_name}</h2>
                    </Jumbotron>
                    <Row>
                        <Col>
                            <h6 className="title display-7">About the club</h6>
                            <div id="club-desc" className="ml-3 bigger-text">
                                {club.club_desc}
                            </div>
                        </Col>
                        <Col md='auto'>
                            <div><span className="h5">{club.club_name}</span> has completed <span className="h3">{club.this_month}</span> this month</div>
                        </Col>
                    </Row>
                    <hr />
                    <div className="my-5">
                        <h6 className="title display-6">Coaches</h6>
                        {club.coaches.map(coach => (
                            <div className="my-2 ml-3">
                                <NavLink to={`/betterathletes/profile/${coach.user_id}`} style={{ textDecoration: "none" }} key={coach.user_id} className="bigger-text2">
                                    {coach.name}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                    <div className="my-5">
                        <h6 className="title display-6">Athletes</h6>
                        {club.athletes.map(a => (
                            <div className="my-2 ml-3">
                                <NavLink to={`/betterathletes/profile/${a.user_id}`} style={{ textDecoration: "none" }} key={a.user_id} className="bigger-text2">
                                    {a.name}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </> :
                <Jumbotron>
                    <h2 className="display-4">Loading...</h2>
                </Jumbotron>
            }

        </Container>

    )
}

export default ViewClub
