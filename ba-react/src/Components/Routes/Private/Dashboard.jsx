import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import AthleteDash from './DashboardItems/AthleteDash'
import CoachDash from './DashboardItems/CoachDash'
import {axiosInstance} from '../../../func/axiosApi'
import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';

function Dashboard({load, isAuth, setAuth, setUser, setIs_coach, user, is_coach}) {
    console.log("Initial Load");
    console.log(load);
    return (
        <>
        {load ? 
        <Row>
            {is_coach == true ?
            <CoachDash />:
            <AthleteDash />
            }
        </Row> : 
        <Row>
        Loading
        </Row>
        }
        </>
    )
}

export default Dashboard
