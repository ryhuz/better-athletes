import React from 'react'
import LoggedInLanding from "../LandingPage/LoggedInLanding"
import LandingPage from "../LandingPage/LandingPage"

function Landing({ isAuth }) {
    return (
        <>
            {isAuth.valid ? <LoggedInLanding /> :
                <LandingPage />
            }
        </>
    )
}

export default Landing
