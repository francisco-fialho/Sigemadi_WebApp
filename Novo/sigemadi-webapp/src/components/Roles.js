import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Divider, Message, Icon } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'

function Roles(props) {

    const [userRoles, setUserRoles] = useState([])

    const roles = [{
        name: 'administrator',
        value: <Header size='medium' key='admin'><Link to='/auth/admin' onClick={() => selectRole('administrator','/auth/admin')}>Administrator</Link></Header>
    },
    {
        name: 'lab_responsible',
        value: <Header size='medium' key='resp'><Link to='/auth/labmanager' onClick={() => selectRole('lab_responsible','/auth/labmanager')}>Laboratory Responsible</Link></Header>
    },
    {
        name: 'teacher',
        value: <Header size='medium' key='doc'><Link to='/auth/teacher' onClick={() => selectRole('teacher','/auth/teacher')}>Teacher</Link></Header>
    },
    {
        name: 'technician',
        value: <Header size='medium' key='tecn'><Link to='/auth/tech' onClick={() => selectRole('technician','/auth/tech')}>Technician</Link></Header>
    },
    {
        name: 'staff',
        value: (<Header size='medium' key='func'><Link to='/auth/staff' onClick={() => selectRole('staff','/auth/staff')}>Staff</Link></Header>)
    },
    ]

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userinfo'))
        let availableRoles = []
        userInfo.roles.map(role => role.name != 'student' ? (availableRoles.push(roles.find(r => r.name === role.name).value)) : null)
        setUserRoles(availableRoles)
    }, [])

    function selectRole(name,route) {
        const user = JSON.parse(localStorage.getItem('userinfo'))
        user.selectedRole = {
            name:name,
            homeRoute:route
        }
        localStorage.removeItem('userinfo')
        localStorage.setItem('userinfo', JSON.stringify(user))
    }

    return (
        <div>
            <Header size='medium'>Choose a Role:</Header>
            <SemanticToastContainer />
            <Divider />
            {
                userRoles.length==0?<Message>Loading...<Icon name='circle notched' loading/></Message>:userRoles
            }

        </div>
    )
}

export default Roles