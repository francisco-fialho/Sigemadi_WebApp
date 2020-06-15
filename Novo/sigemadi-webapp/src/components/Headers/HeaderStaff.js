import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Icon, Image } from 'semantic-ui-react'
import SigemadiLogo from '../../assets/SigemadiLogo.png'
import IselAdeetcLogo from '../../assets/IselAdeetcLogo.png'

const HeaderStaff = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/staff' className='link'> Home <Icon size='small' name='home' /></Link></Header>
                <Header size='medium' style={style}><Link to={{ pathname: '/auth/staff/material' }} className='link'>Material <Icon size='small' name='microchip' /></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/staff/request' className='link'>Request <Icon size='small' name='clipboard list' /></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
                <Image src={SigemadiLogo} style={{width:'8%', height:'8%'}} floated='right' />
                <Image src={IselAdeetcLogo} size='small' floated='left' />
            </div>
            <div style={{marginTop:'7%'}}>
                {children}
            </div>
        </div>
    )
}

export default HeaderStaff