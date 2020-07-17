import React from 'react'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import Desintegratin_html from '../../assets/Desintegrating_html.png'

const Page404 = ({ home }) => {

    const user = localStorage.getItem('userinfo')

    const homeUrl = user != null ? JSON.parse(user).selectedRole.homeRoute : '/'

    return (
        <div style={{ backgroundImage: `url(${Desintegratin_html})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
            {
                home ? <Header style={{ display: 'flex' }}><Link to={homeUrl}>Go to Home</Link></Header> : null
            }
            <Header size='huge' style={{ display: 'flex', marginTop: '10%' }}>404</Header>
            <Header size='huge' style={{ display: 'flex' }}>Page Not Found!</Header>
        </div>
    )
}
export default Page404 