import React from 'react'
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
        <div>
            LOGGING OUT
        </div>
    )
}

export default Logout
