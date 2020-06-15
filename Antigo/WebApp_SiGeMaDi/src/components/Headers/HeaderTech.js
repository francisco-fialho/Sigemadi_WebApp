import React from 'react'
import { Link } from 'react-router-dom'
import { Header,Icon } from 'semantic-ui-react'

const HeaderTech = ({ children }) => {

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }

    return (
        <div>
            <div>
                <Header size='medium' style={style}><Link to='/auth/tech' className='link'>Home <Icon size='small'  name='home'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/tech/damages' className='link'>Material <Icon size='small'  name='bug'/></Link></Header>
                <Header size='medium' style={style}><Link to='/auth/tech/history' className='link'>History <Icon size='small' name='history'/></Link></Header>
                <Header size='medium' style={style}><Link to='/' className='link'>Logout</Link></Header>
            </div>
            {children}
        </div>
    )
}

export default HeaderTech 