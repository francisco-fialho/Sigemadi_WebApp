import React, { useState, useEffect } from 'react'
import CheckBox from '../../CheckBox/CheckBox'
import Filter from '../../Utils/Filter'
import axios from 'axios'
import { Card, Header, Segment, Form, TextArea, ButtonGroup, Button, Grid } from 'semantic-ui-react'
import { sci_areasUrl, sci_areaUrl, subjectsUrl, typeSci_AreaUrl } from '../../Utils/Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import ResponseHandler from '../../ResponseHandler'


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
    const [disableButton, setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('userinfo')).roles.find(role => role.name === 'lab_responsible')
        httpsAxios.get(sci_areasUrl)
            .then(resp => {
                const specific = resp.data['sci_areas'].find(s => s.id === role.sci_area_id)
                const geral = resp.data['sci_areas'].find(s => s.id === 0)

                httpsAxios.get(sci_areaUrl.replace(':id', role.sci_area_id))
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
                    }).catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })


        httpsAxios.get(subjectsUrl)
            .then(resp => {
                setGeralSubjects(resp.data['subjects'].map(s => s.id))
            }).catch(err => setError(ResponseHandler(err.response)))
    }, [])


    function onConfirm() {
        const checked = Object.keys(checkboxes).filter(checkbox => checkboxes[checkbox])

        if (name === '' || name.trimLeft().length == 0) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a name for the new type',
                time: 2000,
                size: 'mini'
            })
        }
        if (description === '' || description.trimLeft().length == 0) {
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
            setDisableButton(true)
            httpsAxios.post(typeSci_AreaUrl.replace(':sciAreaId', sci_area.id),
                { "name": name, "description": description, "subjects": checked })
                .then(resp => {
                    ResponseHandler(resp)
                    setTimeout(() => props.history.push(props.location.pathname.replace('/addtype', '/type')), 3000)
                })
                .catch(err => {
                    ResponseHandler(err.response)
                    setDisableButton(false)
                })
        }

        else {
            setDisableButton(true)
            httpsAxios.post(typeSci_AreaUrl.replace(':sciAreaId', sci_area.id),
                { "name": name, "description": description, "subjects": geralSubjects })
                .then(resp => {
                    ResponseHandler(resp)
                    setTimeout(() => props.history.push(props.location.pathname.replace('/addtype', '/type')), 3000)
                })
                .catch(err => {
                    ResponseHandler(err.response)
                    setDisableButton(false)
                })
        }


    }
    function onCancel() {
        props.history.push('/auth/labmanager/type')
    }


    function onChangeArea(value) {
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

    function onChangeCheckbox(event) {
        const { name } = event.target
        selectCheckBox(name)
    }

    function createCheckBoxes() {
        if (subjects.length === 0) return <Header>All Subjects Selected</Header>
        return subjects.map(s => {
            return <Grid.Column key={s.type}>
                <CheckBox
                    name={s.id}
                    label={s.name}
                    isSelected={checkboxes[s.id]}
                    onCheckboxChange={onChangeCheckbox}
                    key={s.type}
                />

            </Grid.Column>
        })
    }

    const style = {
        height: 30,
        marginLeft: '5%',
        padding: 8
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

                                    <Filter changeFilter={onChangeArea} name="sci_area" types={sci_areas} value={sci_area.id} />
                                    <div style={{ marginTop: '2%' }}>

                                        <Header>Subjects:</Header>
                                        <Grid columns={5} style={style} centered>
                                            {createCheckBoxes()}
                                        </Grid>

                                    </div>
                                </Card.Meta>
                                <Card.Description style={{ marginTop: '10%' }}>
                                    <Header attached='top'>New Material Type</Header>
                                    <Segment attached>
                                        <Header>Name:</Header>
                                        <Form>
                                            <TextArea required onChange={(event, object) => setName(object.value)} style={{ textAlign: 'center' }} maxLength='15'></TextArea>
                                        </Form>
                                        <Header>Description:</Header>
                                        <Form>
                                            <TextArea required onChange={(event, object) => setDescription(object.value)} style={{ textAlign: 'center' }} maxLength='150'></TextArea>
                                        </Form>
                                    </Segment>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <ButtonGroup fluid>
                                    <Button basic color='green' id='confirm' content='Confirm' disabled={disableButton} onClick={onConfirm}></Button>
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