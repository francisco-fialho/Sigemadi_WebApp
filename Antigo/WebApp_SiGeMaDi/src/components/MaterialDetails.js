import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Label, Header, List, Card, Form, Button, Divider, Message, Icon } from 'semantic-ui-react'
import Response_Handler from './ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts';
import { materialUrl } from './Links'
import Page_404 from './Errors/Page404'


const titles = [
    {
        title: 'Name',
        value: 'name'
    },
    {
        title: 'Type',
        value: 'type'
    },
    {
        title: 'Scientific Areas',
        value: 'sci_area'
    },
    {
        title: 'Subjects',
        value: 'subjects'
    },

]

function Material_Details(props) {


    const [material, setMaterial] = useState({
        subjects: []
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = props.match.params['id']
        axios.get(materialUrl.replace(':id', id))
            .then(resp => {
                setMaterial({
                    ...resp.data,
                    id: id
                })
            })
            .catch(err => {
                //VERIFICAR SE EXISTE
                setError(Response_Handler(err.response))
            })
    }, [])


    function buildMaterialInfo(values) {
        return values.map((value, i) => {
            if (i + 1 === values.length) {
                return value
            }
            else {
                return value + ', '
            }
        })
    }

    function onReport() {
        const location = props.location.pathname.replace('/material', '/report')
        props.history.push(location)
    }


    function buildInfoTable() {
        return titles.map(t => {
            let value = material[t.value]
            if (t.value === 'subjects') value = buildMaterialInfo(value)
            return (
                <List.Item key={t.title}>
                    <List.Content floated='left'>
                        <List.Header>{t.title}</List.Header>
                    </List.Content>
                    <List.Content floated='right'>
                        <List.Description >{value}</List.Description>
                    </List.Content>
                </List.Item>
            )
        })
    }

    function canReport() {
        const user = JSON.parse(sessionStorage.getItem('userinfo'))
        return user.selectedRole === 'employee'
    }

    function buildStateInfo() {
        if (material.state === null) {
            return
        }
        else {
            let color = 'red'
            if (material.state === 'available')
                color = 'green'

            return <Label size='huge' color={color}>
                State:
                <Label.Detail>{material.state}</Label.Detail>
            </Label>
        }
    }

    return (
        <div>

            <SemanticToastContainer />
            {
                error ? error :
                    !material.name ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Header size='medium'>Material Details</Header>
                            <Divider />

                            {
                                buildStateInfo(this)

                            }

                            <List divided>
                                {
                                    buildInfoTable(this)
                                }
                            </List>
                            {
                                //MUDAR AQUI PARA O CAN_BE_REPORTED
                                (material.can_be_reported && canReport()) ?
                                    <Button size='medium' color='red' style={{ marginBottom: '5%' }} onClick={() => onReport()} icon='bug' content='Report Damage'></Button>
                                    : null
                            }
                            <Card.Group itemsPerRow={2} stackable>
                                <Card>
                                    <Card.Content>
                                        <Card.Header>
                                            Description
                        </Card.Header>
                                        <Divider />
                                        <Card.Description>
                                            <Card.Header size='medium'>{material.description}</Card.Header>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                                <Card>
                                    <Card.Content>
                                        <Card.Header>
                                            More Information
                        </Card.Header>
                                        <Divider />
                                        <Card.Description>
                                            {
                                                //METER OS LINKS
                                            }
                                        </Card.Description>

                                    </Card.Content>
                                </Card>
                            </Card.Group>
                        </div>
            }
        </div>
    )
}


export default Material_Details