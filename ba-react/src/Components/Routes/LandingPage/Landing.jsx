import React from 'react'
import LoggedInLanding from "../LandingPage/LoggedInLanding"
import LandingPage from "../LandingPage/LandingPage"

function Landing({ isAuth }) {
    return (
        <div className="landing full-height">
            {isAuth.valid ? <LoggedInLanding user_id={isAuth.user_id} /> :
                <LandingPage />
            }
        </div>
    )
}

export default Landing
