import React, { useEffect, useState } from 'react'
import { Header, List, Button, Input, Divider, Message, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { sci_areaUrl, subjectsSci_Area_By_IdUrl } from '../Utils/Links'
import ResponseHandler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts';

function Subjects_Management(props) {


    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState('')
    const [sci_area, setSci_Area] = useState({})
    const [error, setError] = useState(null)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })

    useEffect(() => {
        const id = props.match.params['id']

        httpsAxios.get(sci_areaUrl.replace(':id', id))
            .then(resp => {
                setSubjects(resp.data['subjects'] || [])
                setSci_Area({ name: resp.data.name, id: id })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }, [])

    function getSubjects() {
        httpsAxios.get(sci_areaUrl.replace(':id', sci_area.id))
            .then(resp => {
                setSubjects(resp.data['subjects'] || [])
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function deleteSubject(id) {
        const deleteButton = document.getElementById(`delete${id}`)
        deleteButton.disabled = true
        httpsAxios.delete(subjectsSci_Area_By_IdUrl.replace(':sciAreaId', sci_area.id) + `/${id}`)
            .then(resp => {
                ResponseHandler(resp)
                setTimeout(() => getSubjects(), 3000);
            }).catch(err => {
                deleteButton.disabled = false
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function addSubject() {

        let data = document.getElementById('addsubject')
        if (data.value != '' && subject != '') {
            httpsAxios.post(subjectsSci_Area_By_IdUrl.replace(':sciAreaId', sci_area.id), { 'name': subject })
                .then(resp => {
                    data.value = ''
                    ResponseHandler(resp)
                    setTimeout(() => getSubjects(), 3000);

                }).catch(err => {
                    const error = ResponseHandler(err.response)
                    setTimeout(() => { setError(error) }, 3000)
                })
        }
    }

    function onChangeSubject(value) {
        if (value != '' && value.trimLeft().length != 0) {
            setSubject(value)
        }
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    !sci_area.id ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Header size='medium'>Scientific Area: {sci_area.name}</Header>
                            <Divider />
                            <Header size='medium'>Subjects:</Header>
                            <div className="ui medium action input">
                                <Input id="addsubject" type="text" maxLength='4' onChange={(event, object) => onChangeSubject(object.value)} action={<Button onClick={addSubject}>Add</Button>} placeholder="Subjects..." />
                            </div>
                            <List divided>
                                {
                                    subjects.map(subject => {
                                        return <List.Item key={subject.id}>
                                            <List.Content floated='right'>
                                                <Button size='big' id={'delete' + subject.id} compact onClick={() => deleteSubject(subject.id)} icon='red close'></Button>
                                            </List.Content>
                                            <List.Content>
                                                {subject.name}
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
export default Subjects_Management