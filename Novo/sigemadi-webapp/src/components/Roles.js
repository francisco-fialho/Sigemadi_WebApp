import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Divider, Message, Icon } from 'semantic-ui-react'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'

function Roles(props) {

    const [userRoles, setUserRoles] = useState([])

    const roles = [{
        name: 'administrator',
        value: <Header size='medium' key='admin'><Link to='/auth/admin' onClick={() => selectRole('administrator')}>Administrator</Link></Header>
    },
    {
        name: 'lab_responsible',
        value: <Header size='medium' key='resp'><Link to='/auth/labmanager' onClick={() => selectRole('lab_responsible')}>Laboratory Responsible</Link></Header>
    },
    {
        name: 'teacher',
        value: <Header size='medium' key='doc'><Link to='/auth/teacher' onClick={() => selectRole('teacher')}>Teacher</Link></Header>
    },
    {
        name: 'technician',
        value: <Header size='medium' key='tecn'><Link to='/auth/tech' onClick={() => selectRole('technician')}>Technician</Link></Header>
    },
    {
        name: 'staff',
        value: (<Header size='medium' key='func'><Link to='/auth/staff' onClick={() => selectRole('staff')}>Staff</Link></Header>)
    },
    ]

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userinfo'))
        let availableRoles = []
        userInfo.roles.map(role => role.name != 'student' ? (availableRoles.push(roles.find(r => r.name === role.name).value)) : null)
        if (availableRoles.length == 0) {
            toast({
                type: 'error',
                title: 'Something Went Wrong',
                time: 2000,
                size: 'mini',
                description: 'Student users can´t login!'
            })
            setTimeout(() => props.history.push(''), 3000)
        }
        setUserRoles(availableRoles)
    }, [])

    function selectRole(name) {
        const user = JSON.parse(sessionStorage.getItem('userinfo'))
        user.selectedRole = name
        sessionStorage.removeItem('userinfo')
        sessionStorage.setItem('userinfo', JSON.stringify(user))
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