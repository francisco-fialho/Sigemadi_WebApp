import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Divider } from 'semantic-ui-react'
import axios from 'axios'
import Cookies from 'universal-cookie'


const Roles = () => {

    const roles = [{
        name: 'administrator',
        value: <Header size='medium' key='admin'><Link to='/auth/admin' onClick={()=>selectRole('administrator')}>Administrator</Link></Header>
    },
    {
        name: 'lab_responsible',
        value: <Header size='medium' key='resp'><Link to='/auth/labmanager' onClick={()=>selectRole('lab_responsible')}>Laboratory Responsible</Link></Header>
    },
    {
        name: 'teacher',
        value: <Header size='medium' key='doc'><Link to='/auth/teacher' onClick={()=>selectRole('teacher')}>Teacher</Link></Header>
    },
    {
        name: 'technician',
        value: <Header size='medium' key='tecn'><Link to='/auth/tech' onClick={() => selectRole('technician')}>Technician</Link></Header>
    },
    {
        name: 'employee',
        value: (<Header size='medium' key='func'><Link to='/auth/staff' onClick={() => selectRole('employee')}>Staff</Link></Header>)
    },
    ]
    //NAO DEIXAR FAZER LOGINS A PESSOAS QUE SO SEJAM ESTUDANTES

    const getUserRoles = () => {
        const userInfo = JSON.parse(sessionStorage.getItem('userinfo'))
        let userRoles = []
        userInfo.roles.map(role => role.name != 'student' ? (userRoles.push(roles.find(r => r.name === role.name).value)) : null)
        return userRoles
    }

    function selectRole(name, link) {
        const user = JSON.parse(sessionStorage.getItem('userinfo'))
        user.selectedRole = name
        sessionStorage.removeItem('userinfo')
        sessionStorage.setItem('userinfo', JSON.stringify(user))
    }

    return (
        <div>
            <Header size='medium'>Choose a Role:</Header>
            <Divider />
            {
                getUserRoles()
            }

        </div>
    )
}

export default Roles