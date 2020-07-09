import React, { useState, useEffect } from 'react'
import Filter from '../../Utils/Filter'
import { Card, Header, ButtonGroup, Button, Input } from 'semantic-ui-react'
import axios from 'axios'
import { sci_areaUrl, sci_areasUrl, materialsUrl } from '../../Utils/Links'
import Response_Handler from '../../ResponseHandler';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const MAX = '10'
const MIN = '1'

function New_Material(props) {

    const [types, setTypes] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [type, setType] = useState('')
    const [sci_area, setSci_Area] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState(null)
    const [disableButton,setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        httpsAxios.get(sci_areaUrl.replace(':id', role.sci_area_id))
            .then(response => {
                httpsAxios.get(sci_areasUrl)
                    .then(r => {
                        const specific = r.data['sci_areas'].find(s => s.id === role.sci_area_id)
                        const geral = r.data['sci_areas'].find(s => s.id === 0)
                        setSci_Area({ id: specific.id })
                        setSci_Areas([specific, geral])
                        setTypes(response.data['types'])
                        setType(response.data['types'][0])
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }, [])

    function onConfirm() {
        if (type === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Select a type to associate the new material',
                time: 2000,
                size: 'mini'
            })
        }
        
        setDisableButton(true)

        httpsAxios.post(materialsUrl, { "quantity": quantity, "type": type.id })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => props.history.push(props.location.pathname.replace('/addmaterial', '/material')), 3000)
            })
            .catch(err => {
                setDisableButton(false)
                Response_Handler(err.response)
            })

    }

    function onCancel() {
        props.history.push('/auth/labmanager/material')
    }

    function onChangeArea(value) {
        if (value.id != 'all') {
            httpsAxios.get(sci_areaUrl.replace(':id', value.id))
                .then(resp => {
                    setSci_Area(value)
                    setTypes(resp.data['types'])
                })
        }
    }


    function onChangeType(value) {
        if (value.id !== 'all')
            setType(value)
    }

    function onChangeQuantity(value) {
        if (parseInt(value) < parseInt(MIN)) {
            setQuantity(MIN)
        }
        if (parseInt(value) > parseInt(MAX)) {
            setQuantity(MAX)
        }
        else {
            setQuantity(value)
        }
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>Add Material</Card.Header>
                            <Card.Meta style={{ marginTop: '2%' }}>
                                <Card.Header >Scientific Area: </Card.Header>
                                <Filter changeFilter={onChangeArea} name="sci_area" types={sci_areas} value={sci_area.id} />
                                <div style={{ display: 'block', float: 'right' }}>
                                    <Header size='medium'>Material Type:</Header>
                                    <Filter changeFilter={onChangeType} name="type" types={types} value={type.id} />
                                </div>
                                <div style={{ float: 'left' }}>
                                    <Header size='medium'>Quantity:</Header>
                                    <Input type="number" size='mini' required defaultValue={1} onChange={(event, object) => onChangeQuantity(object.value)} min={MIN} max={MAX} style={{ width: '90%' }}></Input>
                                </div>
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <ButtonGroup fluid>
                                <Button basic id='confirm' color='green' content='Confirm' disabled={disableButton} onClick={onConfirm}></Button>
                                <Button basic color='red' content='Cancel' onClick={onCancel}></Button>
                            </ButtonGroup>
                        </Card.Content>
                    </Card>
            }

        </div>
    )
}

export default New_Material