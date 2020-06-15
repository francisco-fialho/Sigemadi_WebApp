import React from 'react'
import { Link } from 'react-router-dom'
import { Header,Icon } from 'semantic-ui-react'

const HeaderLabManager = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/labmanager' className='link'>Home <Icon size='small' name='home'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/labmanager/material' className='link'>Material <Icon size='small' name='microchip'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/labmanager/type' className='link'>Material Types <Icon size='small' name='tags'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/statistics' className='link'>Statistics <Icon size='small' name='line graph'/></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
            </div>
            {children}
        </div>
    )
}

export default HeaderLabManager