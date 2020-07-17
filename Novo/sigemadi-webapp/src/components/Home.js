import React from 'react'
import isel_Sigemadi from '../assets/iselSigemadi.png'
import { Header, Image } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import { SemanticToastContainer } from 'react-semantic-toasts';


function Home(props) {

    return (
        <div>
            <SemanticToastContainer />

            <Header floated='right' style={{ cursor: 'pointer', color: '#a22717' }} content='Login'><Link to='/login'>Login</Link></Header>
            <Header size='huge'>SiGeMaDi</Header>
            <Image className="ui fluid centered image" src={isel_Sigemadi} style={{ marginTop: '5%' }} /> 
        </div>
    )
}

export default Home