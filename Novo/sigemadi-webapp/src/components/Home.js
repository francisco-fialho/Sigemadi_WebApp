import React, { useState, useEffect } from 'react'
import isel_Sigemadi from '../assets/iselSigemadi.png'
import Cookies from 'universal-cookie'
import { Header, Image } from 'semantic-ui-react'
import { userUrl, userRolesUrl } from './Utils/Links'
import httpAxios from '../resources/HttpsAxios'
import Response_Handler from './ResponseHandler'
import {Link} from 'react-router-dom'
import { SemanticToastContainer } from 'react-semantic-toasts';

const cookies = new Cookies()

function Home(props) {

    //const [modal, setModal] = useState(false)

    // function cleanCookies() {
    //     //cookies.remove('request')
    //     localStorage.removeItem('userinfo')
    // }

    // useEffect(() => {
    //     //cleanCookies()
    //     localStorage.clear()
    // }, [])


    // function handleOpen() {
    //     setModal(true)
    // }

    // function handleClose() {
    //     setModal(false)
    // }

    // function onSubmit() {


    //     handleClose()
    //     const number = document.getElementById('number').value
    //     const password = document.getElementById('password').value
    //     httpsAxios.get(userUrl.replace(':id', number))
    //         .then(resp => {
    //             //verificar se existe aqui senao nao faz o proximo pedido
    //             httpAxios.get(userRolesUrl.replace(':id', number))
    //                 .then(res => {
    //                     localStorage.setItem('userinfo',JSON.stringify({ roles: res.data['roles'], ...resp.data }))
    //                     props.history.push('/auth/roles')
    //                 }).catch(err => Response_Handler(err.response))
    //         }).catch(err => {
    //             Response_Handler(err.response)
    //         })
    // }
                // <Modal
            //     trigger={<Header floated='right' style={{ cursor: 'pointer', color: '#a22717' }} onClick={handleOpen} content='Login'></Header>}
            //     open={modal}
            //     basic
            //     dimmer='blurring'
            //     onClose={handleClose}
            //     size='large'
            // >
            //     <Modal.Content>
            //         <Form onSubmit={onSubmit}>
            //             <Form.Field>
            //                 Number
            //                     <Input size='large' id='number' placeholder='Identification Number' />
            //             </Form.Field>
            //             <Form.Field type='password'>
            //                 Password
            //                     <Input type='password' size='large' id='password' placeholder='Password' />
            //             </Form.Field>
            //             <Button size='large' type='submit'>Submit</Button>
            //         </Form>
            //     </Modal.Content>
            //     <Modal.Actions>
            //         <ButtonGroup fluid>
            //             <Button basic color='red' size='large' onClick={handleClose} content='Cancel' inverted></Button>
            //         </ButtonGroup>
            //     </Modal.Actions>
            // </Modal>

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