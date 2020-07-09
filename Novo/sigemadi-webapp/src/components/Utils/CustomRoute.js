import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom';
import LoginContext from '../Login/LoginContext';


function CustomRoutes(props) {

    const [route, setRoute] = useState(null)

    useEffect(() => {
        switch (props.role) {
            case 'staff':
                return setRoute(
                    //VER COMO È QUE VEM OS ROLES
                    props.user.roles == 'staff' ? (
                        <Route {...props} />
                    ) : (
                            <Redirect to="/login" />
                        )
                );
            case 'teacher':
                return setRoute(
                    props.user.roles == 'teacher' ? (
                        <Route {...props} />
                    ) : (
                        <Redirect to="/login" />
                        )
                );
            case 'technician':
                return setRoute(
                    props.user.roles == 'technician' ? (
                        <Route {...props} />
                    ) : (
                        <Redirect to="/login" />
                        )
                );
            case 'labmanager':
                return setRoute(
                    props.user.roles == 'lab_responsible' ? (
                        <Route {...props} />
                    ) : (
                        <Redirect to="/login" />
                        )
                );
            case 'administrator':
                return setRoute(
                    props.user.roles == 'administrator' ? (
                        <Route {...props} />
                    ) : (
                        <Redirect to="/login" />
                        )
                );

            default:
                return setRoute(
                    <Route {...props} />
                );
        }

    }, [props.user])

    return route
}

export default CustomRoutes