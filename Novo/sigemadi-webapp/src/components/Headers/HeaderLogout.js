import React from 'react'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

const HeaderLogout = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/' className='link'>Home</Link></Header>
                <Header size='medium' style={style}><Link to='/login' className='link'>Login</Link></Header>
            </div>
            {children}
        </div >
    )
}

export default HeaderLogout