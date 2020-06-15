import React from 'react'
import { Link } from 'react-router-dom'
import { Header,Icon } from 'semantic-ui-react'

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
                <Header size='medium' style={style}><Link to='/auth/statistics' className='link'>Statistics <Icon size='small' name='line graph'/></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
            </div>
            {children}
        </div>
    )
}

export default HeaderAdmin