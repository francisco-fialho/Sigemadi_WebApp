import React, { useState, useEffect } from 'react'
import CheckBox from '../../CheckBox/CheckBox'
import Filter from '../../Utils/Filter'
import axios from 'axios'
import { Card, Header, Segment, Form, TextArea, ButtonGroup, Button } from 'semantic-ui-react'
import Cookies from 'universal-cookie'
import { sci_areasUrl, sci_areaUrl, subjectsUrl, typeSci_AreaUrl } from '../../Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'


function New_Type(props) {

    const [subjects, setSubjects] = useState([])
    const [sci_area_subjects, setSci_AreaSubject] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [sci_area, setSci_Area] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [geralSubjects, setGeralSubjects] = useState([])
    const [checkboxes, setCheckboxes] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const role = JSON.parse(sessionStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        axios.get(sci_areasUrl)
            .then(resp => {
                const specific = resp.data['sci_areas'].find(s => s.id === role.sci_area_id)
                const geral = resp.data['sci_areas'].find(s => s.id === 0)

                axios.get(sci_areaUrl.replace(':id', role.sci_area_id))
                    .then(r => {
                        setSci_Areas([specific, geral])
                        setSubjects(r.data['subjects'])
                        setSci_AreaSubject(r.data['subjects'])
                        setSci_Area({ id: specific.id })
                        setCheckboxes(r.data['subjects'].reduce(
                            (options, option) => ({
                                ...options,
                                [option.id]: false,
                            }),
                            []
                        ))
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))


        axios.get(subjectsUrl)
            .then(resp => {
                setGeralSubjects(resp.data['subjects'].map(s => s.id))
            }).catch(err => setError(Response_Handler(err.response)))
    }, [])


    function onConfirm() {
        const checked = Object.keys(checkboxes).filter(checkbox => checkboxes[checkbox])
        const button = document.getElementById('confirm')

        if (name === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a name for the new type',
                time: 2000,
                size: 'mini'
            })
        }
        if (description === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a description for the new type',
                time: 2000,
                size: 'mini'
            })
        }


        if (sci_area.id != 0) {
            if (checked.length === 0) {
                return toast({
                    type: 'warning',
                    title: 'Missing Information',
                    description: 'Select subjects to associate with the new type',
                    time: 2000,
                    size: 'mini'
                })
            }
            button.disabled = true

            axios.post(typeSci_AreaUrl.replace(':sci_area_id', sci_area.id),
                { "name": name, "description": description, "subjects": checked })
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => props.history.goBack(), 2000)
                })
                .catch(err => {
                    Response_Handler(err.response)
                    button.disabled = false
                })
        }

        else {
            button.disabled = true

            axios.post(typeSci_AreaUrl.replace(':sci_area_id', sci_area.id),
                { "name": name, "description": description, "subjects": geralSubjects })
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => props.history.goBack(), 2000)
                })
                .catch(err => {
                    Response_Handler(err.response)
                    button.disabled = false
                })
        }


    }
    function onCancel() {
        props.history.push('/auth/labmanager/type')
    }


    function changeSci_Area(value) {
        if (value.id === 'all') value = ''
        else { 
            if (value.id == '0') {
                setSubjects([])
            }
            else {
                setSubjects(sci_area_subjects)
            }
            setSci_Area(value)
        }
    }


    function selectCheckBox(id) {
        setCheckboxes(
            {
                ...checkboxes,
                [id]: !checkboxes[id]
            }
        )
    }

    function onChange(event) {
        const { name } = event.target
        selectCheckBox(name)
    }

    function createCheckBoxes() {
        if (subjects.length === 0) return <Header>All Subjects Selected</Header>
        return subjects.map(s => {
            return <div key={s.type}>
                <CheckBox
                    name={s.id}
                    label={s.name}
                    isSelected={checkboxes[s.id]}
                    onCheckboxChange={onChange}
                    key={s.type}
                />

            </div>
        })
    }


    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Add Material Type</Card.Header>
                                <Card.Meta style={{ marginTop: '2%' }}>

                                    <Card.Header >Scientific Area:</Card.Header>

                                    <Filter changeFilter={changeSci_Area} name="sci_area" types={sci_areas} value={sci_area.id} />
                                    <div style={{ marginTop: '2%' }}>

                                        <Header>Subjects:</Header>

                                        {createCheckBoxes()}

                                    </div>
                                </Card.Meta>
                                <Card.Description style={{ marginTop: '10%' }}>
                                    <Header attached='top'>New Material Type</Header>
                                    <Segment attached>
                                        <Header>Name:</Header>
                                        <Form>
                                            <TextArea required onChange={(event, object) => setName(object.value)} style={{ textAlign: 'center' }} maxLength='10'></TextArea>
                                        </Form>
                                        <Header>Description:</Header>
                                        <Form>
                                            <TextArea required onChange={(event, object) => setDescription(object.value)} style={{ textAlign: 'center' }} maxLength='20'></TextArea>
                                        </Form>
                                    </Segment>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <ButtonGroup fluid>
                                    <Button basic color='green' id='confirm' content='Confirm' onClick={onConfirm}></Button>
                                    <Button basic color='red' content='Cancel' onClick={onCancel}></Button>
                                </ButtonGroup>
                            </Card.Content>
                        </Card>
                    </div>
            }
        </div >
    )
}
export default New_Type