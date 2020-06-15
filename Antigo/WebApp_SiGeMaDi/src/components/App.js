import React, { Component, useState, useEffect } from 'react'
import isel_Sigemadi from '../assets/isel_Sigemadi.png'
import Cookies from 'universal-cookie'
import { Header, Image, Modal, Button, ButtonGroup, Input, Label, Form } from 'semantic-ui-react'
import { userUrl, userRolesUrl } from './Links'
import axios from 'axios'
import Response_Handler from './ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts';

const cookies = new Cookies()

function App(props) {

    const [modal, setModal] = useState(false)

    function cleanCookies() {
        cookies.remove('request')
        sessionStorage.removeItem('userinfo')
    }

    useEffect(() => {
        cleanCookies()
        localStorage.clear()
    }, [])


    function handleOpen() {
        setModal(true)
    }

    function handleClose() {
        setModal(false)
    }

    function onSubmit() {

// FAZER VERIFICAÇÃO SE EXISTE O USER E SO DEPOIS É QUE FAÇO LOGIN

        handleClose()
        const number = document.getElementById('number').value
        const password = document.getElementById('password').value
        axios.get(userUrl.replace(':id', number))
            .then(resp => {
                //verificar se existe aqui senao nao faz o proximo pedido

                axios.get(userRolesUrl.replace(':id', number))
                    .then(res => {
                        sessionStorage.setItem('userinfo',JSON.stringify({ roles: res.data['roles'], ...resp.data }))
                        // cookies.set('userinfo', )
                        props.history.push('/auth/roles')
                    }).catch(err => Response_Handler(err.response))
            }).catch(err => Response_Handler(err.response))
    }

    return (
        <div>
            <SemanticToastContainer />
            <Modal
                trigger={<Header floated='right' style={{ cursor: 'pointer', color: '#a22717' }} onClick={handleOpen} content='Login'></Header>}
                open={modal}
                basic
                dimmer='blurring'
                onClose={handleClose}
                size='large'
            >
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Field>
                            Number
                                <Input size='large' id='number' placeholder='Identification Number' />
                        </Form.Field>
                        <Form.Field type='password'>
                            Password
                                <Input type='password' size='large' id='password' placeholder='Password' />
                        </Form.Field>
                        <Button size='large' type='submit'>Submit</Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <ButtonGroup fluid>
                        <Button basic color='red' size='large' onClick={handleClose} content='Cancel' inverted></Button>
                    </ButtonGroup>
                </Modal.Actions>
            </Modal>
            <Header size='large'>Didatic Material Managment</Header>
            <Image className="ui fluid centered image" src={isel_Sigemadi} style={{ marginTop: '5%' }} /> 
        </div>
    )
}

export default App