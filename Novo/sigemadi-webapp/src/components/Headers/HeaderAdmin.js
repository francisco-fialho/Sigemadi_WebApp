import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Icon, Image } from 'semantic-ui-react'
import SigemadiLogo from '../../assets/SigemadiLogo.png'
import IselAdeetcLogo from '../../assets/IselAdeetcLogo.png'

const HeaderAdmin = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30,
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/admin' className='link'>Home <Icon size='small' name='home'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/admin/usersroles' className='link'>Roles <Icon size='small' name='users'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/admin/areas' className='link'>Scientific Areas <Icon size='small' name='graduation'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/admin/statistics' className='link'>Statistics <Icon size='small' name='line graph'/></Link></Header>
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

export default HeaderAdmin