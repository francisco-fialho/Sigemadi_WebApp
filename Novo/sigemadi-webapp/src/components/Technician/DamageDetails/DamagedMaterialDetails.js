import React from 'react'
import { Header, List, TextArea, Card, ButtonGroup, Button, Label, CardGroup, Form, Divider } from 'semantic-ui-react'
import Option from '../../Utils/Option'



const titles = [
    {
        title: 'Material Id',
        value: 'material_id'
    },
    {
        title: 'Name',
        value: 'material_name'
    },
    {
        title: 'Request Id',
        value: 'request'
    },
    {
        title: 'User',
        value: 'user'
    },
    {
        title: 'Date',
        value: 'start_date'
    },
]

function Damaged_Material_Details(props) {

    function buildInfoTable() {
        return titles.map(t => {
            if (props.material_report[t.value] === undefined) return null
            return (
                <List.Item key={t.title}>
                    <List.Content floated='left'>
                        <List.Header>{t.title}</List.Header>
                    </List.Content>
                    <List.Content floated='right'>
                        <List.Description >{props.material_report[t.value]}</List.Description>
                    </List.Content>
                </List.Item>
            )
        })
    }

    function buildStateInfo() {
        let detail = props.material_report.state
        let color = 'red'
        if (props.history) {
             if(props.material_report.state === 'solved'){
                 color='green'
             }
        }
        return <Label size='huge' color={color}>
            State:
                <Label.Detail>{detail}</Label.Detail>
        </Label>
    }

    function buildInfo() {
        if (props.history) {
            return (<Card fluid>
                <Card.Content>
                    <Card.Header>Solution Description</Card.Header>
                    <Card.Description>
                        <Divider />
                        <Card.Header size='small'>{props.material_report.report}</Card.Header>
                    </Card.Description>
                </Card.Content>
            </Card>)
        }
        else {
            return (
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Solution Description</Card.Header>
                        <Card.Description>
                            <Form>
                                <TextArea rows="2" required maxLength="200" onChange={(event, object) => props.changeMaterialReport({ ...props.material_report, report: object.value })}></TextArea>
                            </Form>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <ButtonGroup fluid>
                            <Button basic color='green' id='confirm' onClick={props.onSave} content='Confirm' />
                            <Button basic color='red' onClick={props.onCancel} content='Cancel' />
                        </ButtonGroup>
                    </Card.Content>
                </Card>
            )
        }
    }




    return (
        <div>
            <Header size='medium'>Material Details</Header>
            {
                buildStateInfo()

            }
            <Divider />
            {
                props.history ? null : <div style={{ display: 'block' }}>
                    Change Report State:
                        <Option values={props.material_report.states} value={props.material_report.state} changeOption={props.changeState}></Option>
                </div>
            }

            <List divided>
                {
                    buildInfoTable()
                }
            </List>
            <CardGroup>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Report Description</Card.Header>
                        <Card.Description>
                            <Divider />
                            <Card.Header size='small'>{props.material_report.description}</Card.Header>
                        </Card.Description>
                    </Card.Content>
                </Card>
                {
                    buildInfo()
                }
            </CardGroup>

        </div >
    )
}
export default Damaged_Material_Details