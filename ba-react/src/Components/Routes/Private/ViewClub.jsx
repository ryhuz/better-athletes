import React, { useEffect, useState } from 'react'
import { Col, Container, Jumbotron, Row } from 'react-bootstrap'
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

    console.log(club);

    return (
        <Container>
            {Object.keys(club).length ?
                <>
                    <Jumbotron>
                        <h2 className="display-4">{club.club_name}</h2>
                    </Jumbotron>
                    <Row>
                        <Col>
                            <h6>About the club</h6>
                            <div id="club-desc">
                                {club.club_desc}
                            </div>
                        </Col>
                        <Col md='auto'>
                            <div><span className="h5">{club.club_name}</span> has completed <span className="h3">{club.this_month}</span> this month</div>
                        </Col>
                    </Row>
                    <hr />
                    <h6>Coaches</h6>
                    {club.coaches.map(coach => (
                        <div key={coach.user_id} className="club-coaches">
                            {coach.name}1
                        </div>
                    ))}
                    <h6>Athletes</h6>
                    {club.athletes.map(a => (
                        <div key={a.user_id} className="club-coaches">
                            {a.name}
                        </div>
                    ))}
                </> :
                <Jumbotron>
                    <h2 className="display-4">Loading...</h2>
                </Jumbotron>
            }

        </Container>

    )
}

export default ViewClub
