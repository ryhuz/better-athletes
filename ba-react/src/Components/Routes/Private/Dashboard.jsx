import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import AthleteDash from './DashboardItems/AthleteDash'
import CoachDash from './DashboardItems/CoachDash'

function Dashboard() {
    /* GET USER TYPE FROM TOKEN ?????????????????????? */
    const [userType, setUserType] = useState("Athlete")

    return (
        <Row>
            {userType === "Coach" ?
            <CoachDash />:
            <AthleteDash />
            }
        </Row>
    )
}

export default Dashboard
