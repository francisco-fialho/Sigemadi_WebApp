import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Header, Card, Segment, TextArea, ButtonGroup, Button, Form, Divider } from 'semantic-ui-react'
import { materialUrl, reportMaterialUrl } from './Utils/Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'
import Response_Handler from './ResponseHandler'


function Report_Material(props) {

    const [description, setDescription] = useState('')
    const [material, setMaterial] = useState(null)
    const [user, setUser] = useState(null)
    const [disableButton,setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {

        const userId = JSON.parse(localStorage.getItem('userinfo')).id
        setUser(userId)
        const materialId = props.match.params['id']
        if (materialId.slice(0, 2) == '00') {
            setDisableButton(true)

            props.history.push(props.location.pathname.replace('/report', ''))
        }


        httpsAxios.get(materialUrl.replace(':id', materialId))
            .then(async resp => {
                if (resp.data['state'] === 'available')
                    setMaterial(materialId)
                else {
                    props.history.push(props.location.pathname.replace('/report', ''))
                }
            })
            .catch(err => {
                Response_Handler(err.response.status)
            })

    }, [])

    function onConfirm() {
        if (description == '' || description.trimLeft().length == 0) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a damage description',
                time: 2000,
                size: 'mini'
            })
        }

        setDisableButton(true)

        httpsAxios.post(reportMaterialUrl.replace(':id', material), { "description": description, "user": user })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => {
                    props.history.push(props.location.pathname.replace('/report', ''))
                }, 3000)
            })
            .catch(err => {
                setDisableButton(false)
                Response_Handler(err.response)
            })

    }


    function onCancel() {
        props.history.push(props.location.pathname.replace('/report', ''))
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
                    <Button basic id='confirm' color='green' onClick={onConfirm} disabled={disableButton} content='Confirm' />
                    <Button basic color='red' onClick={onCancel} content='Cancel' />
                </ButtonGroup>
                <Card.Content extra>
                </Card.Content>
            </Card>
        </div >
    )
}


export default Report_Material