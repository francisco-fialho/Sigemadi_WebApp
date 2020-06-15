import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Icon } from 'semantic-ui-react'

const HeaderStaff = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/staff' className='link'> Home <Icon size='small' name='home'/></Link></Header>
                <Header size='medium' style={style}><Link to={{ pathname: '/auth/staff/material' }} className='link'>Material <Icon size='small' name='microchip'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/staff/request' className='link'>Request <Icon size='small' name='file alternate'/></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
            </div>
            {children}
        </div>
    )
}
 
export default HeaderStaff