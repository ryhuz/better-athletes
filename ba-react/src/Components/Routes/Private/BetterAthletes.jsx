import React from 'react'
import { Route, Redirect } from "react-router-dom"


function BetterAthletes({ component: Component, isAuth, ...rest }) {
    return (
        <Route {...rest} render={props=>(
            isAuth.valid ?
            <Component {...props}{...rest} isAuth={isAuth} /> :
            !isAuth.refreshed &&
                < Redirect to='/login' />
        )}>
        </Route>
    )
}

export default BetterAthletes

