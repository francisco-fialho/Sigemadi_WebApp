import React, { useState } from "react"
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from './LoginPage'
import { loginUrl, userUrl,userRolesUrl } from '../Utils/Links'
import ResponseHandler from '../ResponseHandler'
import { toast } from "react-semantic-toasts"
import axios from "axios"

function Login(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedIn())

    function handleLogin() {
        setIsLoggedIn(checkLoggedIn())
    }
    
    async function login(username, password) {
        localStorage.clear()

        const resp = await axios.post(loginUrl, {},{
            auth: {
                username: username,
                password: password
            }
        }).catch(err => {
            ResponseHandler(err.response)
            return null
        })

        if (!resp) return

      
        const token = resp.data.token
        

        const response = await axios.get(userUrl.replace(':id', username), { headers: { 'Authorization': 'Bearer ' + token } }).catch(err => {
            ResponseHandler(err.response)
            return null
        })
        
        if (!response) return


        let userinfo = response.data

        const responseRoles = await axios.get(userRolesUrl.replace(':id', username)).catch(err => {
            ResponseHandler(err.response)
            return null
        })
        if (!responseRoles) return

        const roles = responseRoles.data['roles']
        if (roles.find(r => r.name == 'student')) {
            return toast({
                type: 'error',
                title: 'Forbidden Access',
                description: 'Students can´t login in WebApp',
                time: 2000,
                size: 'mini'
            })
        }

        
        userinfo.roles = roles
        await localStorage.setItem('userinfo', JSON.stringify(userinfo))


        return localStorage.setItem('token', token)

    }

    function checkLoggedIn() {
        return localStorage.getItem('token') != null
    }


    return (
        <Switch>
            <Route exact path="/login">
                {!isLoggedIn ? <LoginPage login={login} onLogin={handleLogin} /> : <Redirect to="/auth/roles" />
                }
            </Route>
            <Route>
                {!isLoggedIn ?
                    <Redirect to="/login" /> :
                    props.children
                }
            </Route>
        </Switch>
    )
}

export default Login