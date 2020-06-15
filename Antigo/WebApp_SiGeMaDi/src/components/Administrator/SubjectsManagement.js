import React, { useEffect, useState } from 'react'
import { Header, List, Button, Input, Divider, Message, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { sci_areaUrl, subjectsSci_Area_By_IdUrl } from '../Links'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts';

function Subjects_Management(props) {


    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState('')
    const [sci_area, setSci_Area] = useState({})
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = props.match.params['id']

        axios.get(sci_areaUrl.replace(':id', id))
            .then(resp => {
                setSubjects(resp.data['subjects'] || [])
                setSci_Area({ name: resp.data.name, id: id })
            }).catch(err => setError(Response_Handler(err.response)))
    }, [])

    function getSubjects() {
        axios.get(sci_areaUrl.replace(':id', sci_area.id))
            .then(resp => {
                setSubjects(resp.data['subjects'] || [])
                setSubject('')
            }).catch(err => setError(Response_Handler(err.response)))
    }

    function deleteSubject(id) {
        const deleteButton = document.getElementById(`delete${id}`)
        deleteButton.disabled = true
        axios.delete(subjectsSci_Area_By_IdUrl.replace(':sci_area_id', sci_area.id) + `/${id}`)
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => getSubjects(), 2000);
            }).catch(err => {
                Response_Handler(err.response)
                deleteButton.disabled = false
            })
    }

    function addSubject() {

        let data = document.getElementById('addsubject')
        if (data.value != '' && subject != '') {
            axios.post(subjectsSci_Area_By_IdUrl.replace(':sci_area_id', sci_area.id), { 'subject': subject })
                .then(resp => {
                    data.value = ''
                    Response_Handler(resp)
                    setTimeout(() => getSubjects(), 2000);

                }).catch(err => {
                    Response_Handler(err.response)
                })
        }
    }

    function onChangeSubject(value) {
        if (value != '') {
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