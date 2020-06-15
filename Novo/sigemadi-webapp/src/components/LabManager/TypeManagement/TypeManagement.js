import React, { useState, useEffect } from 'react'
import { Header, Button, List, Divider } from 'semantic-ui-react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { sci_areaUrl, typeSci_Area_By_IdUrl } from '../../Utils/Links'
import Response_Handler from '../../ResponseHandler';
import { SemanticToastContainer } from 'react-semantic-toasts';



function Type_Management(props) {


    const [types, setTypes] = useState([])
    const [sci_area, setSci_Area] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const role = JSON.parse(sessionStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        setSci_Area(role.sci_area_id)
        searchTypes(role.sci_area_id)
    }, [])

    function searchTypes(sci_area_id) {
        axios.get(sci_areaUrl.replace(':id', sci_area_id))
            .then(response => {
                axios.get(sci_areaUrl.replace(':id', '0'))
                    .then(resp => {
                        setTypes([...response.data['types'], ...resp.data['types']])
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }

    function onSubmit() {
        props.history.push('/auth/labmanager/addtype')
    }

    function deleteTypes(id) {
        const button = document.getElementById('delete' + id)
        button.disabled = true

        let area = sci_area

        if (id.slice(0, 2) == '00') area = '0'

        axios.delete(typeSci_Area_By_IdUrl.replace(':sciAreaId', area).replace(':id', id))
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => searchTypes(sci_area), 3000)
            })
            .catch(err => {
                Response_Handler(err.response)
                button.disabled = false
            })
    }

    function createTypesList() {

        return types.map(type => {
            return <List.Item key={type.id}>
                <List.Content floated='right'>
                    <Button size='big' compact icon='red close' id={'delete' + type.id} onClick={() => deleteTypes(type.id)}></Button>
                </List.Content>
                <List.Content>
                    {type.name}
                </List.Content>
            </List.Item>
        })
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>
                        <Header size='medium'>Material Type:</Header>
                        <Button size='medium' icon='add' content='Add Type' onClick={onSubmit}></Button>
                        <Divider />
                        <List divided>
                            {
                                createTypesList()
                            }
                        </List>
                    </div>
            }

        </div>
    )
}

export default Type_Management