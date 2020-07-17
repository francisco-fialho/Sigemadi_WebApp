import React from 'react'
import { Header } from 'semantic-ui-react'
import Desintegratin_html from '../../assets/Desintegrating_html.png'

const Page500 = () => {

    return (
        <div style={{ backgroundImage: `url(${Desintegratin_html})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
            <Header size='huge' style={{ display: 'flex', marginTop: '10%' }}>500</Header>
            <Header size='huge' style={{ display: 'flex' }}>Internal Server Error!</Header>
        </div>
    )
}
export default Page500