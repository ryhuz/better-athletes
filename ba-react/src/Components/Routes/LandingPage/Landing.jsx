import React from 'react'
import LoggedInLanding from "../LandingPage/LoggedInLanding"
import LandingPage from "../LandingPage/LandingPage"

function Landing({ isAuth }) {
    return (
        <div className="landing full-height">
            {isAuth.valid ? <LoggedInLanding /> :
                <LandingPage />
            }
        </div>
    )
}

export default Landing
