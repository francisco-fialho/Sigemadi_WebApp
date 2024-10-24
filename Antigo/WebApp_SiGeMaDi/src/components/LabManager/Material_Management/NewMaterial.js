import React, { useState, useEffect } from 'react'
import Filter from '../../Utils/Filter'
import { Card, Header, ButtonGroup, Button, Input } from 'semantic-ui-react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { sci_areaUrl, sci_areasUrl, materialsUrl } from '../../Links'
import Response_Handler from '../../ResponseHandler';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const cookies = new Cookies()
const MAX = '10'
const MIN = '1'

function New_Material(props) {

    const [types, setTypes] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [type, setType] = useState('')
    const [sci_area, setSci_Area] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [error,setError] = useState(null)

    useEffect(() => {
        const role = JSON.parse(sessionStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        axios.get(sci_areaUrl.replace(':id', role.sci_area_id))
            .then(response => {
                axios.get(sci_areasUrl)
                    .then(r => {
                        const specific = r.data['sci_areas'].find(s => s.id === role.sci_area_id)
                        const geral = r.data['sci_areas'].find(s => s.id === 0)
                        setSci_Area({ id: specific.id })
                        setSci_Areas([specific, geral])
                        setTypes(response.data['types'])
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

        let unit = true
        if (type.id.slice(0, 2) === '00') {
            unit = false
        }
        const button = document.getElementById('confirm')
        button.disabled = true

        axios.post(materialsUrl, { "quantity": quantity, "unit": unit, "type": type.id })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => props.history.goBack(), 2000)
            })
            .catch(err => {
                button.disabled = false
                Response_Handler(err.response)
            })

    }

    function onCancel() {
        props.history.push('/auth/labmanager/material')
    }


    function changeSci_Area(value) {
        if (value.id === 'all') value = ''
        else {
            axios.get(sci_areaUrl.replace(':id', value.id))
                .then(resp => {
                    setSci_Area(value)
                    setTypes(resp.data['types'])
                })
        }
    }


    function changeType(value) {
        if (value.id === 'all') value = ''
        setType(value)
    }

    function changeQuantity(value) {
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
                                <Filter changeFilter={changeSci_Area} name="sci_area" types={sci_areas} value={sci_area.id} />
                                <div style={{ display: 'block', float: 'right' }}>
                                    <Header size='medium'>Material Type:</Header>
                                    <Filter changeFilter={changeType} name="type" types={types} value={type.id} />
                                </div>
                                <div style={{ float: 'left' }}>
                                    <Header size='medium'>Quantity:</Header>
                                    <Input type="number" size='mini' required defaultValue={1} onChange={(event, object) => changeQuantity(object.value)} min={MIN} max={MAX} style={{ width: '90%' }}></Input>
                                </div>
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <ButtonGroup fluid>
                                <Button basic id='confirm' color='green' content='Confirm' onClick={onConfirm}></Button>
                                <Button basic color='red' content='Cancel' onClick={onCancel}></Button>
                            </ButtonGroup>
                        </Card.Content>
                    </Card>
            }

        </div>
    )
}

export default New_Material