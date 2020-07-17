import React, { useState, useEffect } from 'react'
import { Header, Button, List, Divider } from 'semantic-ui-react'
import axios from 'axios'
import { sci_areaUrl, typeSci_Area_By_IdUrl } from '../../Utils/Links'
import ResponseHandler from '../../ResponseHandler';
import { SemanticToastContainer } from 'react-semantic-toasts';



function Type_Management(props) {


    const [types, setTypes] = useState([])
    const [sci_area, setSci_Area] = useState('')
    const [error, setError] = useState(null)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })

    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        setSci_Area(role.sci_area_id)
        searchTypes(role.sci_area_id)
    }, [])

    function searchTypes(sci_area_id) {
        httpsAxios.get(sci_areaUrl.replace(':id', sci_area_id))
            .then(response => {
                httpsAxios.get(sci_areaUrl.replace(':id', '0'))
                    .then(resp => {
                        setTypes([...response.data['types'], ...resp.data['types']])
                    }).catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }


    function deleteTypes(id) {
        const button = document.getElementById('delete' + id)
        button.disabled = true

        let area = sci_area

        if (id.split('-')[0] == 0) area = '0'

        httpsAxios.delete(typeSci_Area_By_IdUrl.replace(':sciAreaId', area).replace(':id', id))
            .then(resp => {
                ResponseHandler(resp)
                setTimeout(() => searchTypes(sci_area), 3000)
            })
            .catch(err => {
                button.disabled = false
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function onSubmit() {
        props.history.push('/auth/labmanager/addtype')
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