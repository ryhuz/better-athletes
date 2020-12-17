import React from 'react'
import { Container, Row } from 'react-bootstrap'
import AthleteDash from './DashboardItems/AthleteDash'
import CoachDash from './DashboardItems/CoachDash'

function Dashboard({ isAuth }) {

    return (
        <div className="mx-10">
            <Row className="pt-5" sm={1}>
                {isAuth.coach ?
                    <CoachDash /> :
                    <AthleteDash />
                }
            </Row>
        </div>
    )
}

export default Dashboard
