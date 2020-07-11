import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom';


function CustomRoute(props) {

    const [route, setRoute] = useState('')


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userinfo'))

        switch (props.role) {
            case 'staff':
                return setRoute(
                    user.roles.find(r => r.name == 'staff') ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to={user.selectedRole.homeRoute} />
                        )
                );
            case 'teacher':
                return setRoute(
                    user.roles.find(r => r.name == 'teacher') ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to={user.selectedRole.homeRoute} />
                        )
                );
            case 'technician':
                return setRoute(
                    user.roles.find(r => r.name == 'technician') ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to={user.selectedRole.homeRoute} />
                        )
                );
            case 'labmanager':
                return setRoute(
                    user.roles.find(r => r.name == 'lab_responsible') ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to={user.selectedRole.homeRoute} />
                        )
                );
            case 'administrator':
                return setRoute(
                    user.roles.find(r => r.name == 'administrator') ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to={user.selectedRole.homeRoute} />
                        )
                );

            default:
                return setRoute(
                    <Route {...props} />
                );
        }

    }, [props])

    return route
}

export default CustomRoute