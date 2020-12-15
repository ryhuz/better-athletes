import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import { axiosInstance } from "../../../func/axiosApi";

function Logout({ isAuth, setAuth }) {

    useEffect(() => {
        function logout() {
            localStorage.removeItem("token");
            axiosInstance.defaults.headers['Authorization'] = null;
            setAuth(false);
        }

        logout()
    }, [])

    if (!isAuth) {
        return <Redirect to="/" />
    }
    return (
        <div>
            LOGGING OUT
        </div>
    )
}

export default Logout
