import React, { useEffect, useState } from 'react'
import CheckBox from '../CheckBox/CheckBox'
import Option from '../Utils/Option'
import { Card, Image, Button, Icon, Message } from 'semantic-ui-react'
import axios from 'axios'
import { rolesUrl, userRolesUrl, userUrl, sci_areasUrl } from '../Utils/Links'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';


function Define_Roles(props) {

    const [roles, setRoles] = useState([])
    const [person, setPerson] = useState({})
    const [sci_area, setSci_Area] = useState('all')
    const [sci_areas, setSci_Areas] = useState('all')
    const [checkboxes, setCheckboxes] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = props.match.params['id']

        axios.get(sci_areasUrl)
            .then(resp_sciareas => {
                axios.get(userRolesUrl.replace(':id', id))
                    .then(r => {

                        if (r.data['roles'].find(r => r.name == 'student' || r.name == 'staff') != undefined) {
                            toast({
                                type: 'error',
                                time: 2000,
                                size: 'mini',
                                title: 'Invalid Parameter',
                                description: 'It is not permited change either student or staff role'
                            })
                            setTimeout(() => {
                                props.history.push(props.location.pathname.replace(`/${id}`, ''))
                            }, 3000)
                        }
                        else {
                            let all_sci_areas = resp_sciareas.data['sci_areas']
                            all_sci_areas.shift()
                            setSci_Areas(all_sci_areas)

                            axios.get(rolesUrl)
                                .then(resp_roles => {

                                    axios.get(userUrl.replace(':id', id))
                                        .then(resp => {

                                            setPerson(resp.data)
                                            const user_roles = r.data['roles']
                                            let availableRoles = resp_roles.data['roles'].filter(r => r != 'student' && r != 'staff')

                                            const selectedRoles = selectUserRoles(availableRoles, user_roles, all_sci_areas)

                                            setRoles(selectedRoles)
                                            setCheckboxes(selectedRoles.reduce(
                                                (options, option) => ({
                                                    ...options,
                                                    [option.name]: option.selected,
                                                }),
                                                []
                                            ))

                                        }).catch(err => setError(Response_Handler(err.response)))
                                }).catch(err => setError(Response_Handler(err.response)))
                        }
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))


    }, [])

    function changeArea(value) {
        if (value != 'all')
            setSci_Area(value)
    }

    function selectUserRoles(availableRoles, user_roles, sci_areas) {

        const role = user_roles.find(r => r.name == 'lab_responsible')
        if (role != undefined) {
            setSci_Area(sci_areas.find(s => s.id === role.sci_area_id).name)
        }

        return availableRoles.map(r => {
            let selected = false
            if (user_roles.find(role => role.name === r))
                selected = true
            return {
                name: r,
                selected: selected
            }
        })
    }

    function createCheckBoxes() {
        return roles.map(r => {
            return (<div key={r.name} >
                <CheckBox
                    name={r.name}
                    label={r.name}
                    isSelected={checkboxes[r.name]}
                    onCheckboxChange={onChange}
                    key={r.name}
                />
                {
                    r.name === 'lab_responsible' ?
                        <div >
                            <Option values={sci_areas.map(a => a.name)} value={sci_area} changeOption={changeArea} defaultValue="Scientific Area"></Option>
                        </div> :
                        null
                }
            </div>)
        })
    }



    function onSubmit() {
        const confirmButton = document.getElementById('confirm')

        let checked = Object.keys(checkboxes)
            .filter((checkBox) => checkboxes[checkBox]).map(r => { return { 'role': r } })

        let idx = ''
        if ((idx = checked.findIndex(r => r.role === 'lab_responsible')) >= 0) {
            if (sci_area === 'all')
                return toast({
                    type: 'warning',
                    title: 'Missing Information',
                    description: 'Select Scientific Area to associate with the responsible',
                    time: 2000,
                    size: 'mini'
                })
            
            checked[idx] = {
                role: 'lab_responsible',
                sci_area: sci_area
            }
        }
        confirmButton.disabled = true

        axios.put(userRolesUrl.replace(':id', person.id), { 'roles': checked })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => props.history.push(props.location.pathname.replace(`/${person.id}`, '')), 3000)
            }).catch(err => {
                confirmButton.disabled = false
                Response_Handler(err.response)
            })


    }

    function selectCheckBox(name) {
        setCheckboxes({
            ...checkboxes,
            [name]: !checkboxes[name]
        })
    }
    function onChange(event) {
        const { name } = event.target
        selectCheckBox(name)
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    roles.length == 0 ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Card style={{ float: 'right' }}>
                                <Image src={`data:image/jpeg;base64,${person.photo}`} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{person.name}</Card.Header>
                                    <Card.Meta>{person.id}</Card.Meta>
                                </Card.Content>
                            </Card>
                            <div style={{ display: 'inline-block' }}>
                                {
                                    createCheckBoxes()
                                }
                            </div>
                            <Button floated='right' id='confirm' color='green' icon='check' onClick={onSubmit} content='Confirm'></Button>
                        </div>
            }
        </div>
    )
}

export default Define_Roles