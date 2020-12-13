import React from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'

function Dashboard() {
    async function retrieve(){
        try{
            console.log()
            let data = await axios.get(`http://localhost:8000/api/testing`)
            console.log(data)
        }
        catch(e){
            console.log(e)
        }
    }


    retrieve()

    return (
        <Row md={2}>
            <Col>
                <div className="border m-3">
                    Pending Your Review
                </div>
            </Col>
            <Col>
                <div className="border m-3">
                    Today's Agenda
                </div>
            </Col>
            <Col>
                <div className="border m-3">
                    Workouts Pending Athlete's Results
                </div>
            </Col>
            <Col>
                <div className="border m-3">
                    Recently Completed
                </div>
            </Col>
            <Col>
            
            </Col>
            <Col>
            
            </Col>
        </Row>
    )
}

export default Dashboard
