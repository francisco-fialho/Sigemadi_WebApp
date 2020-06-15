import React, { useEffect, useState } from 'react'
import ProfilePicMatthew from '../../assets/matthew.png'
import axios from 'axios'
import { Input, Button, Card, Image, Header, List, Divider } from 'semantic-ui-react'
import { userUrl, requestsUrl, requestUrl, userRolesUrl, requestUpdateUrl } from '../Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../ResponseHandler'

const MIN = '1'
const MAX = '10'
function Checkout_Request(props) {


    const [material, setMaterial] = useState(null)
    const [requestId, setRequestId] = useState(null)
    const [id, setId] = useState('ID')
    const [name, setName] = useState('Name')
    const [photo, setPhoto] = useState(ProfilePicMatthew)
    const [error, setError] = useState(null)

    useEffect(() => {
        const requestId = props.match.params.id

        if (requestId != undefined) {
            axios.get(requestUrl.replace(":id", requestId))
                .then(resp => {
                    setRequestId(requestId)
                    setId(resp.data["user_id"])
                    setName(resp.data["user_name"])
                }).catch(err => setError(Response_Handler(err.response)))
        }

        const materialChecked = uniMaterial(JSON.parse(localStorage.getItem('material')))
        setMaterial(materialChecked)
    }, [])


    function uniMaterial(material) {
        const materialInfo = material.reduce((materials, material) => {
            const id = material.id.slice(0, 2)
            let uni = true
            if (id === '00') {
                uni = false
            }
            materials.push({ ...material, uni: uni })
            return materials
        }, [])

        return materialInfo
    }

    function searchProfile() {
        const id = document.getElementById("searchprofile").value

        axios.get(userUrl.replace(':id', id))
            .then(resp => {

                axios.get(userRolesUrl.replace(':id', id))
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
                    .catch(err => Response_Handler(err.response))
            })
            .catch(err => Response_Handler(err.response))
    }


    //TENHO QUE IR BUSCAR CADA MATERIAL NAO UNITARIO PARA PODER METER O MAX = AVAILABLE OU METO UM CERTO VALOR 10?
    function buildMaterialInfo() {
        if (!material) return
        return (<List size='large' divided style={{ marginBottom: '5%' }}>
            {
                material.map(material => {
                    if (!material.uni) {
                        return <List.Item key={material.id}>
                            <List.Content floated='left'>
                                <List.Header >{material.name}</List.Header>
                            </List.Content>
                            <List.Content floated='right'>
                                <List.Description>
                                    Quantity:
                                    <Input id={`${material.id}quantity`} type="number" required placeholder="Quantity" min={MIN} max={MAX}></Input>
                                </List.Description>
                            </List.Content>
                        </List.Item>

                    } else {
                        return <List.Item key={material.id}>
                            <List.Content floated='left'>
                                <List.Header >{material.name}</List.Header>
                            </List.Content>
                        </List.Item>
                    }
                })
            }
        </List>
        )
    }

    function buildMaterialRequested() {
        let verifyQuantity = false

        let materials_requested = material.reduce((materials, material) => {
            if (material.uni) {
                materials.push({ 'material_id': material.id, 'quantity': '1' })
            }
            else {
                const quantity = document.getElementById(`${material.id}quantity`).value
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
                materials.push({ 'material_id': material.id, 'quantity': quantity })
            }
            return materials
        }, [])

        if (verifyQuantity) materials_requested = null

        return materials_requested
    }

    function onSubmit() {
        const submitButton = document.getElementById('submit')

        if (id != 'ID') {

            const material = buildMaterialRequested()
            if (material === null) return
            submitButton.disabled = true

            if (requestId === null) {
                axios.post(requestsUrl, { 'materials_requested': material, 'user_id': id })
                    .then(resp => {
                        Response_Handler(resp)
                        setTimeout(() => {
                            localStorage.removeItem('material')
                            props.history.push('/auth/staff/request')
                        }, 2000)
                    }).catch(err => {
                        Response_Handler(err.response)
                        submitButton.disabled = false
                    })
            }
            else {
                axios.put(requestUpdateUrl.replace(':id', requestId), { "materials": material })
                    .then(resp => {
                        Response_Handler(resp)
                        setTimeout(() => {
                            localStorage.removeItem('material')
                            props.history.push(`/auth/staff/request/${requestId}`)
                        }, 2000)
                    }).catch(err => {
                        submitButton.disabled = false
                        Response_Handler(err.response)
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
                            <Button id='submit' basic size='large' style={{ display: 'inline-block', float: 'right' }} onClick={onSubmit} icon='edit alternate' content='Request' />

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