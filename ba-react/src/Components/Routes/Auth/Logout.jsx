import React from 'react'
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { axiosInstance } from "../../../func/axiosApi";

function Logout({ isAuth, setAuth }) {
    function logout() {
        localStorage.removeItem("token");
        axiosInstance.defaults.headers['Authorization'] = null;
        setAuth({
            valid: false,
            refreshed: false,
            coach: false,
            user: ""
        });
    }

    setTimeout(() => {
        logout()
    }, 1500);

    if (!isAuth.valid) {
        return <Redirect to="/" />
    }

    return (
        <Container className="mt-5 pt-5 title display-4">
            LOGGING OUT
        </Container>
    )
}

export default Logout
