import React, { useEffect, useState } from 'react'
import ProfilePicMatthew from '../../assets/matthew.png'
import axios from 'axios'
import { Input, Button, Card, Image, Header, List, Divider, Message, Icon } from 'semantic-ui-react'
import { userUrl, requestsUrl, requestUrl, userRolesUrl, requestUpdateUrl } from '../Utils/Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import ResponseHandler from '../ResponseHandler'

const MIN = '1'
const MAX = '10'
function Checkout_Request(props) {


    const [material, setMaterial] = useState([])
    const [requestId, setRequestId] = useState(null)
    const [id, setId] = useState('ID')
    const [name, setName] = useState('Name')
    const [photo, setPhoto] = useState(ProfilePicMatthew)
    const [error, setError] = useState(null)
    const [disableButton, setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })

    useEffect(() => {
        const requestId = props.match.params.id

        if (requestId != undefined) {
            httpsAxios.get(requestUrl.replace(":id", requestId))
                .then(resp => {
                    setRequestId(requestId)
                    setId(resp.data["user_id"])
                    setName(resp.data["user_name"])
                    setPhoto(`data:image/jpeg;base64,${resp.data['user_photo']}`)
                }).catch(err => {
                    const error = ResponseHandler(err.response)
                    setTimeout(() => { setError(error) }, 3000)
                })
        }

        const saveObject = requestId == undefined ? 'new_material' : `${requestId}_material`

        const selectedMaterial = JSON.parse(localStorage.getItem(saveObject))
        if (selectedMaterial == null) {
            toast({
                type: 'error',
                title: 'Something Went Wrong',
                time: 2000,
                size: 'mini',
                description: 'Please select the material again!'
            })
            setTimeout(() => props.history.push(props.location.pathname.replace('/checkout', '')), 3000)
        }
        setMaterial(selectedMaterial)
    }, [])


    function searchProfile() {
        const id = document.getElementById("searchprofile").value

        httpsAxios.get(userUrl.replace(':id', id))
            .then(resp => {

                httpsAxios.get(userRolesUrl.replace(':id', id))
                    .then(resp_roles => {
                        if (resp_roles.data['roles'].find(r => r.name === 'student') === undefined) {
                            return toast({
                                type: 'warning',
                                title: 'Wrong Information',
                                description: 'Insert a student number',
                                time: 2000,
                                size: 'mini'
                            })
                        }
                        else {
                            setName(resp.data['name'])
                            setId(resp.data['id'])
                            setPhoto(`data:image/jpeg;base64,${resp.data['photo']}`)
                        }
                    })
                    .catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            })
            .catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function buildMaterialInfo() {
        return (<List size='large' divided style={{ marginBottom: '5%' }}>
            {
                material.map(material => {
                    if (material.id.split('-')[0] == 0) {
                        return <List.Item key={material.id}>
                            <List.Content floated='left'>
                                <List.Header >{material.name}</List.Header>
                            </List.Content>
                            <List.Content floated='right'>
                                <List.Description>
                                    Quantity:
                                    <Input id={`${material.id}quantity`} type="number" required min={MIN} max={material.available_quantity > MAX ? MAX : material.available_quantity}></Input>
                                </List.Description>
                            </List.Content>
                        </List.Item>

                    } else {
                        return <List.Item key={material.id}>
                            <List.Content floated='left'>
                                <List.Header>{material.name}</List.Header>
                            </List.Content>
                        </List.Item>
                    }
                })
            }
        </List>
        )
    }

    function checkMaterialQuantity() {
        let verifyQuantity = false

        let materials_requested = material.reduce((materials, material) => {
            if (material.id.split('-')[0] != 0) {
                materials.push({ 'material_id': material.id, 'quantity': '1' })
            }
            else {
                let quantity = document.getElementById(`${material.id}quantity`).value
                if (quantity == "") {
                    verifyQuantity = true
                    toast({
                        type: 'warning',
                        title: 'Missing Information',
                        time: 2000,
                        size: 'mini',
                        description: `Insert a quantity for the material ${material.name}`
                    })
                    return materials
                }
                if (parseInt(quantity) < parseInt(MIN)) quantity = MIN
                if (parseInt(quantity) > parseInt(MAX)) quantity = MAX
                else if (parseInt(quantity) > parseInt(material.available_quantity)) quantity = material.available_quantity
                toast({
                    type: 'warning',
                    title: 'Quantity updated',
                    time: 2000,
                    size: 'mini',
                    description: `Quantity for material ${material.name} is ${quantity}`
                })
                materials.push({ 'material_id': material.id, 'quantity': quantity })
            }
            return materials
        }, [])

        if (verifyQuantity) materials_requested = null

        return materials_requested
    }

    function onSubmit() {
        const saveObject = requestId == undefined ? 'new_material' : `${requestId}_material`


        if (id != 'ID') {

            const material = checkMaterialQuantity()
            if (material === null) return
            setDisableButton(true)

            if (requestId == null) {
                httpsAxios.post(requestsUrl, { 'materials_requested': material, 'user_id': id })
                    .then(resp => {
                        ResponseHandler(resp)
                        setTimeout(() => {
                            localStorage.removeItem(saveObject)
                            props.history.push('/auth/staff/request')
                        }, 3000)
                    }).catch(err => {
                        setDisableButton(false)
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }
            else {
                httpsAxios.put(requestUpdateUrl.replace(':id', requestId), { "materials": material })
                    .then(resp => {
                        ResponseHandler(resp)
                        setTimeout(() => {
                            localStorage.removeItem(saveObject)
                            props.history.push(`/auth/staff/request/${requestId}`)
                        }, 3000)
                    }).catch(err => {
                        setDisableButton(false)
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }
        }

        else {
            toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a student number to associate with the request',
                time: 2000,
                size: 'mini'
            })
        }
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    material.length == 0 ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Header>Finalize Request</Header>
                            <Divider />
                            <div style={{ display: 'block' }}>
                                {
                                    props.newRequest ?
                                        <div style={{ display: 'inline-block' }}>
                                            <Input size='mini' id="searchprofile" style={{ float: 'left' }} icon='users' iconPosition='left' placeholder='Introduce user number...' />
                                            <Button size='large' basic onClick={searchProfile} style={{ float: 'left' }} icon='search' content='Search'></Button>
                                        </div>
                                        :
                                        null
                                }
                                <Card centered>
                                    <Image src={photo} />
                                    <Card.Content>
                                        <List.Header>{name}</List.Header>
                                        <Card.Meta>{id}</Card.Meta>
                                    </Card.Content>
                                </Card>
                                <Divider />
                                <Button id='submit' size='large' style={{ display: 'inline-block', float: 'right' }} disabled={disableButton} onClick={onSubmit} icon='edit alternate' content='Request' />

                                <div style={{ display: 'block', marginTop: '5%' }}>
                                    <Header size='medium'>Material:</Header>
                                    {buildMaterialInfo(this)}
                                </div>
                            </div>
                        </div>
            }
        </div>
    )
}

export default Checkout_Request