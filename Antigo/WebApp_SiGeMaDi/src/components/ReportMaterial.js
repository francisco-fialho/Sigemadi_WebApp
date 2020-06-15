import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Header, Card, Segment, TextArea, ButtonGroup, Button, Form, Divider } from 'semantic-ui-react'
import Cookies from 'universal-cookie'
import { materialUrl, reportMaterialUrl } from './Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'
import Response_Handler from './ResponseHandler'

const cookie = new Cookies()

function Report_Material(props) {

    const [description, setDescription] = useState('')
    const [material, setMaterial] = useState(null)
    const [user, setUser] = useState(null)


    useEffect(() => {
        const confirmButton = document.getElementById('confirm')

        const userId = JSON.parse(sessionStorage.getItem('userinfo')).id
        setUser(userId)
        const materialId = props.match.params['id']
        if (materialId.slice(0, 2) == '00') {
            confirmButton.disabled = true

            props.history.push(props.location.pathname.replace('/report', '/material'))
        }


        axios.get(materialUrl.replace(':id', materialId))
            .then(async resp => {
                if (resp.data['state'] === 'available')
                    setMaterial(materialId)
                else{
                    props.history.push(props.location.pathname.replace('/report', '/material'))
                }
            })
            .catch(err => {
                Response_Handler(err.response.status)
            })

    }, [])

function onConfirm() {
    const confirmButton = document.getElementById('confirm')

    if (description == '') {
        return toast({
            type: 'warning',
            title: 'Missing Information',
            description: 'Insert a damage description',
            time: 2000,
            size: 'mini'
        })
    }

    confirmButton.disabled = true

    // if (request != null) {
    //     axios.post(reportMaterialRequestUrl.replace(':mid', material).replace(':id', request), { "description": description, "user_reporter": user })
    //         .then(resp => {
    //             Response_Handler(resp)
    //             setTimeout(() => {
    //                 props.history.push(props.location.pathname.replace('/report', '/material'))
    //             }, 2000)
    //         })
    //         .catch(err => {
    //             confirmButton.disabled = false
    //             Response_Handler(err.response)
    //         })
    // }

    axios.post(reportMaterialUrl.replace(':id', material), { "description": description, "user": user })
        .then(resp => {
            Response_Handler(resp)
            setTimeout(() => {
                props.history.push(props.location.pathname.replace('/report', '/material'))
            }, 2000)
        })
        .catch(err => {
            confirmButton.disabled = false
            Response_Handler(err.response)
        })

}


function onCancel() {
    props.history.goBack()
}

return (
    <div>
        <SemanticToastContainer />
        <Header size='medium'>Report Damage: </Header>
        <Divider />
        <Card fluid>
            <Card.Content>
                <Card.Header>{material}</Card.Header>
                <Card.Description>
                    <Header attached='top' color='red'>
                        Report Description
                            </Header>
                    <Segment>
                        <Form>
                            <TextArea required onChange={(event, object) => setDescription(object.value)} rows='2' maxLength='200'></TextArea>
                        </Form>
                    </Segment>
                </Card.Description>
            </Card.Content>
            <ButtonGroup fluid>
                <Button basic id='confirm' color='green' onClick={onConfirm} content='Confirm' />
                <Button basic color='red' onClick={onCancel} content='Cancel' />
            </ButtonGroup>
            <Card.Content extra>
            </Card.Content>
        </Card>
    </div >
)
}


export default Report_Material