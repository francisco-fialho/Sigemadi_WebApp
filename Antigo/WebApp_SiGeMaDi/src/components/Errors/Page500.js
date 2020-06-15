import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Image } from 'semantic-ui-react'
import Desintegratin_html from '../../assets/Desintegrating_html.png'

const Page_500 = () => {
    //MUDAR A LIGAÇÃO OU SABER COMO MANDAR PARA A HOME E ELA SABER SE É A HOME DE RESP/ADMIN/FUNC ETC

    return (
        <div style={{ backgroundImage: `url(${Desintegratin_html})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
            <Header size='huge' style={{ display: 'flex', marginTop: '10%' }}>500</Header>
            <Header size='huge' style={{ display: 'flex' }}>Internal Server Error!</Header>
        </div>
    )
}
export default Page_500