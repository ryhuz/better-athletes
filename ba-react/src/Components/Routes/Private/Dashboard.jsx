import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import AthleteDash from './DashboardItems/AthleteDash'
import CoachDash from './DashboardItems/CoachDash'
import {axiosInstance} from '../../../func/axiosApi'
import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';

function Dashboard({isAuth, setAuth, setUser, setIs_coach, user, is_coach}) {

    useEffect(() => {
        verifyToken();
    }, [])

    function check(){
        let token = localStorage.getItem("token");
        if(token){
          setAuth(true);
        } 
      }

    async function verifyToken(){
        try {
          await axiosInstance.post("token/verify", {
            'token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'accept': 'application/json'
          });
        } catch (error) {
          localStorage.removeItem("token");
          setIs_coach();
          axiosInstance.defaults.headers['Authorization'] = null;
          setAuth(false);
          console.log(error);
        }
        check();
      }

    return (
        <Row>
            {is_coach === true ?
            <CoachDash user = {user} is_coach={is_coach}/>:
            <AthleteDash user = {user} is_coach={is_coach}/>
            }
        </Row>
    )
}

export default Dashboard
