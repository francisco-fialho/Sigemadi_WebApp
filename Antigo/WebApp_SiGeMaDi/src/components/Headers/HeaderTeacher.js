import React from 'react'
import { Link } from 'react-router-dom'
import { Header,Icon } from 'semantic-ui-react'

const HeaderTeacher = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/teacher' className='link'>Home <Icon size='small' name='home'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/teacher/material' className='link'>Material <Icon size='small' name='microchip'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/teacher/reservation' className='link'>Reservation <Icon size='small' name='file alternate'/></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
            </div>
            {children}
        </div>
    )
}

export default HeaderTeacher