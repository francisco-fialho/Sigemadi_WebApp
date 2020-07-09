import React, { useState } from "react"
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from './LoginPage'
import LoginContext from './LoginContext'
import { loginUrl, userUrl } from '../Utils/Links'
import ResponseHandler from '../ResponseHandler'
import httpsAxios from "../../resources/HttpsAxios"
import { toast } from "react-semantic-toasts"
import axios from "axios"

function Login(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedIn())

    function handleLogin() {
        setIsLoggedIn(checkLoggedIn())
    }

    function login(username, password) {
        //mudar para post

        axios.get(loginUrl, {
            auth: {
                username: username,
                password: password
            }
        })
            .then(resp => {
                const token = resp.data.token
                const roles = JSON.parse(atob(token.split('.')[1])).roles
                if(roles.find(r=> r=='student')){
                    return toast({
                        type:'error',
                        title:'Forbidden Access',
                        description:'Students can´t login in WebApp',
                        time:2000,
                        size:'mini'
                    })
                } 

                httpsAxios.get(userUrl.replace(':id', username), { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(resp => {
                        let userinfo = resp.data
                        userinfo.roles = roles
                        localStorage.setItem('token', token)
                        localStorage.setItem('userinfo', JSON.stringify(userinfo))
                    }).catch(err => {
                        ResponseHandler(err.response)
                    })

                console.log('funcionou')
            }).catch(err => {
                ResponseHandler(err.response)
            })
    }

    function checkLoggedIn() {
        return localStorage.getItem('token')!=null
    }

    function getToken() {
        return localStorage.getItem('token')
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
                    //pode dar problemas no getToken
                    <LoginContext.Provider value={{ token: getToken(), login: login, checkLoggedIn: checkLoggedIn }}>{props.children}</LoginContext.Provider>
                }
            </Route>
        </Switch>
    )
}

export default Login