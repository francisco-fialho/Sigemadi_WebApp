import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header, List, Button, Input, Divider } from 'semantic-ui-react'
import axios from 'axios'
import { sci_areasUrl, sci_areaUrl } from '../Utils/Links'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts';

function Scientific_Areas_Management(props) {


    const [sci_areas, setSci_Areas] = useState([])
    const [sci_area, setSci_Area] = useState('')
    const [error, setError] = useState(null)

    
    useEffect(() => {
        getSci_Areas()
    }, [])


    function getSci_Areas() {
        axios.get(sci_areasUrl)
            .then(resp => {
                setSci_Areas(resp.data['sci_areas'].filter(area => area.id != 0))
            }).catch(err => setError(Response_Handler(err.response)))
    }

    function deleteArea(id) {
        const deleteButton = document.getElementById(`delete${id}`)
        deleteButton.disabled = true
        axios.delete(sci_areaUrl.replace(':id', id))
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => getSci_Areas(), 200)

            }).catch(err => {
                deleteButton.disabled = false
                Response_Handler(err.response)
            })
    }

    function addArea() {
        const data = document.getElementById('addarea')


        if (data.value != '' && sci_area != '')
            axios.post(sci_areasUrl, { 'name': sci_area })
                .then(resp => {
                    Response_Handler(resp)
                    data.value = ''
                    setTimeout(() => getSci_Areas(), 3000)

                }).catch(err => {
                    Response_Handler(err.response)
                })
    }

    function onChangeArea(value) {
        if (value != '' && value.trimLeft().length != 0) {
            setSci_Area(value)
        }
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>
                        <Header size='medium'>Scientific Areas:</Header>
                        <Input id="addarea" type="text" onChange={(event, object) => onChangeArea(object.value)} action={<Button onClick={addArea}>Add</Button>} placeholder="Scientific Area..." />
                        <Divider />
                        <List divided>
                            {
                                sci_areas.map(area => {
                                    const url = `/auth/admin/areas/${area.id}/course`
                                    return <List.Item key={area.id}>
                                        <List.Content floated='right'>
                                            <Button size='big' id={'delete' + area.id} compact onClick={() => deleteArea(area.id)} icon='red close'></Button>
                                        </List.Content>
                                        <List.Content>
                                            <Link to={url}> {area.name}</Link>
                                        </List.Content>
                                    </List.Item>
                                })
                            }
                        </List>
                    </div>
            }
        </div>
    )
}
export default Scientific_Areas_Management