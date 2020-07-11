import React, { useEffect, useState } from 'react'
import CheckBox from '../CheckBox/CheckBox'
import axios from 'axios'
import { Card, Button, Image, Modal, Header, Input, List, Divider, Icon, Message } from 'semantic-ui-react'
import { requestUrl, materialRequestUrl, reportMaterialUrl, reportSubmissionUrl } from '../Utils/Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import ResponseHandler from '../ResponseHandler'


const MIN = '1'

function Request_Details(props) {

    const [modal, setModal] = useState(false)
    const [modalTermination, setModalTermination] = useState(false)
    const [request, setRequest] = useState({
        materials: []
    })

    const [selectedMaterials, setSelectedMaterials] = useState([])
    const [checkboxes, setCheckboxes] = useState([])
    const [materialsRemoved, setMaterialsRemoved] = useState([])
    const [materialsHistory, setMaterialsHistory] = useState([])
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [disableButton, setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const id = props.match.params['id']
        setUser(JSON.parse(localStorage.getItem('userinfo')))
        getRequestInfo(id)
    }, [])

    function getRequestInfo(id) {
        httpsAxios.get(requestUrl.replace(':id', id))
            .then(resp => {
                let materialsFiltered = resp.data['materials']
                if (resp.data['close_date'] === undefined) {
                    setMaterialsHistory(materialsFiltered.filter(m => m.close_date != undefined))
                    materialsFiltered = materialsFiltered.filter(m => m.close_date === undefined)
                }
                setRequest({
                    ...resp.data,
                    materials: materialsFiltered,
                    id: id
                })

                setCheckboxes(
                    materialsFiltered.reduce(
                        (options, option) => ({
                            ...options,
                            [option.id]: false
                        }),
                        [])
                )
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function onSubmit() {

        const materialDamaged = request.materials.find(m => m.damage != undefined)
        if (materialDamaged != undefined) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Please confirm material damage reports!',
                time: 2000,
                size: 'mini'
            })
        }

        if (selectedMaterials.length > 0) {
            let materials = []
            selectedMaterials.map(material => {
                materials.push(material)
            })
            setMaterialsRemoved(materials)
            setModal(true)
        }
        else {
            setModalTermination(true)
        }

    }


    function endRequest() {
        setDisableButton(true)

        httpsAxios.patch(requestUrl.replace(':id', request.id), {})
            .then(resp => {
                ResponseHandler(resp)
                setTimeout(() => getRequestInfo(request.id), 3000)
            })
            .catch(err => {
                setDisableButton(false)
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
        setModalTermination(false)
    }

    function removeFromRequest() {
        setDisableButton(true)

        materialsRemoved.map((material, idx) => {
            const id = request.materials.find(m => m.name === material.name).id
            setTimeout(() => {
                httpsAxios.delete(materialRequestUrl.replace(':reqId', request.id).replace(':id', id), { data: { 'quantity': material.quantity } })
                    .then(resp => {
                        ResponseHandler(resp)
                        if (idx + 1 === materialsRemoved.length) {
                            setTimeout(() => {
                                getRequestInfo(request.id)
                                setDisableButton(false)
                            }, 3000)
                            setSelectedMaterials([])
                        }
                    })
                    .catch(err => {
                        setDisableButton(false)
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }, 1000)

        })
        setModal(false)
    }

    function onChange(event) {
        const { name } = event.target
        setCheckboxes({
            ...checkboxes,
            [name]: !checkboxes[name]
        })
        selectMaterial(name)
    }

    function selectMaterial(id) {
        if (selectedMaterials.find(m => m.id == id) != undefined) {
            setSelectedMaterials(selectedMaterials.filter(m => m.id != id))
        }
        else {
            const material = request.materials.find(m => m.id == id)
            if (material != undefined) {
                let newMaterials = selectedMaterials
                newMaterials.push(material)
                setSelectedMaterials(newMaterials)
            }
        }
    }

    function onConfirmReport(id, description) {
        const confirmButton = document.getElementById('confirm' + id)
        const cancelButton = document.getElementById('cancel' + id)
        confirmButton.disabled = true
        cancelButton.disabled = true

        setDisableButton(true)

        httpsAxios.delete(materialRequestUrl.replace(':reqId', request.id).replace(':id', id), { data: { 'quantity': 1 } })
            .then(resp => {
                httpsAxios.post(reportMaterialUrl.replace(':id', id), { "description": description, "user": user.id })
                    .then(resp => {
                        ResponseHandler(resp)
                        setTimeout(() => {
                            getRequestInfo(request.id)
                            setDisableButton(false)
                        }, 3000)
                    })
                    .catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }).catch(err => {
                setDisableButton(false)
                confirmButton.disabled = false
                cancelButton.disabled = false
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function onCancelReport(id) {
        const confirmButton = document.getElementById('confirm' + id)
        const cancelButton = document.getElementById('cancel' + id)
        confirmButton.disabled = true
        cancelButton.disabled = true


        httpsAxios.delete(reportSubmissionUrl.replace(':reqId', request.id).replace(':id', id))
            .then(resp => {
                getRequestInfo(request.id)
            }).catch(err => {
                confirmButton.disabled = false
                cancelButton.disabled = false
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function addMaterial() {
        props.history.push({
            pathname: `${props.location.pathname}/material`,
        })
    }


    function onChangeQuantity(value, material, max) {
        if (parseInt(value) > parseInt(max)) {
            value = max
        }
        if (parseInt(value) < parseInt(MIN)) {
            value = MIN
        }

        let materialsChanged = materialsRemoved
        const idx = materialsRemoved.findIndex(m => m.name === material.name)
        materialsChanged[idx] = { name: material.name, id: material.id, quantity: value }

        setMaterialsRemoved(materialsChanged)
    }

    function createMaterialRequestInfo() {
        if (request.close_date != undefined) {
            return request.materials.map(m => {
                return <Header key={m.id} size='tiny'>{m.name + ' | ' + m.id + ' | ' + 'Quantity: ' + m.quantity}</Header>
            })
        }

        return request.materials.map(m => {
            return <div onSubmit={onSubmit} key={m.id}>
                <CheckBox
                    name={m.id}
                    label={m.name + ' | ' + m.id + ' | ' + 'Quantity: ' + m.quantity}
                    isSelected={checkboxes[m.id]}
                    onCheckboxChange={onChange}
                    key={m.id}
                >
                    {
                        (m.damage === undefined) ? null : (
                            <List.Content floated='right' >
                                <Button.Group size='tiny'>
                                    <Button id={'confirm' + m.id} size='tiny' color='green' onClick={() => onConfirmReport(m.id, m.damage.description)} icon='check' content='Confirm Damage' />
                                    <Button id={'cancel' + m.id} size='tiny' onClick={() => onCancelReport(m.id)} icon='close' content='Cancel' />
                                </Button.Group>
                            </List.Content>
                        )
                    }
                </CheckBox>
            </div>
        })
    }

    function buildMaterialInfo() {
        return materialsRemoved.map(material => {

            if (material.id.split('-')[0] == 0) {
                return <List.Item key={material.id}>
                    <List.Content floated='left'>
                        <Header>{material.name}</Header>
                    </List.Content>
                    <List.Content floated='right'>
                        <Input type="number" size='small' required onChange={(event, object) => onChangeQuantity(object.value, material, material.quantity)} min={MIN} max={material.quantity} style={{ width: '90%' }}></Input>
                    </List.Content>
                </List.Item>

            }
            return <List.Item >
                <List.Content floated='left' key={material.id}>
                    <Header>{material.name}</Header>
                </List.Content>
            </List.Item>
        })
    }

    function modalDeleteMaterial() {
        return <Modal size='small' open={modal} dimmer='blurring' >
            <Header size='huge' textAlign='center'>Remove Material from Request</Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <Header size='large' textAlign='center'>Verify the material and each quantity to remove from request</Header>
                    <Divider />
                    <List divided>
                        {
                            buildMaterialInfo()
                        }
                    </List>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions >
                <Button color='red' onClick={removeFromRequest} content='Remove' />
                <Button onClick={() => setModal(false)} content='Cancel' />
            </Modal.Actions>
        </Modal>
    }

    function modalEndRequest() {
        return <Modal open={modalTermination} basic size='small'>
            <Header icon='exclamation triangle' content='You are about to end this request' />
            <Modal.Content>
                <Modal.Header>
                    Do you really want to end this request?
                </Modal.Header>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' inverted onClick={() => setModalTermination(false)} content='Cancel' />

                <Button color='green' inverted onClick={() => endRequest()} content='Confirm' />
            </Modal.Actions>
        </Modal>
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    request.materials.length === 0 ? <Message>Loading...<Icon loading name='circle notch' /></Message> :
                        <div>
                            <Card style={{ float: 'right' }}>
                                <Image src={`data:image/jpeg;base64,${request.user_photo}`} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{request.user_name}</Card.Header>
                                    <Card.Meta>{request.user_id}</Card.Meta>
                                </Card.Content>
                                <Card.Content extra>
                                    {request.start_date} | {request.start_hour}
                                    {
                                        request.close_date != undefined ?
                                            <div>
                                                <Divider />
                                                Ended
                                            <div>
                                                    {request.close_date} | {request.close_hour}
                                                </div>
                                            </div>
                                            : null
                                    }
                                </Card.Content>
                                {
                                    (materialsHistory.length > 0 && request.close_date == undefined) ? (
                                        <Card.Content extra>
                                            <div>
                                                <List size='tiny' divided>
                                                    <Header>Material Delivered</Header>
                                                    {
                                                        materialsHistory.map(m => {
                                                            return <List.Item key={m.name}>
                                                                <List.Header>{m.name + ' | ' + 'Quantity: ' + m.quantity}</List.Header>
                                                                <List.Description>Delivered: {m.close_date + ' | ' + m.close_hour}</List.Description>
                                                            </List.Item>
                                                        })
                                                    }
                                                </List>
                                            </div>
                                        </Card.Content>
                                    ) : null
                                }
                            </Card>

                            {
                                request.close_date != undefined ? null : (
                                    <div>
                                        <Button id='endButton' disabled={disableButton} floated='right' color={selectedMaterials.length > 0 ? '' : 'red'} onClick={onSubmit} content={selectedMaterials.length > 0 ? 'Remove Material' : 'End Request'} icon='check'></Button>
                                        <Button id='addButton' disabled={disableButton} floated='left' onClick={addMaterial} content='Add Material' icon='add'></Button>
                                    </div>)
                            }

                            <Header>Material: </Header>
                            <Divider />
                            <div style={{ display: 'inline-block' }}>

                                {
                                    createMaterialRequestInfo()
                                }
                            </div>
                        </div >
            }
            {modalDeleteMaterial()}
            {modalEndRequest()}
        </div >
    )



}
export default Request_Details