import React, { useEffect, useState } from 'react'
import ProfilePic from '../../assets/helen.jpg'
import { Card, Icon, Image, Header, Button, ButtonGroup, Modal } from 'semantic-ui-react'
import QrReader from 'react-qr-reader'



function Staff(props) {


    const [user, setUser] = useState({
        id: null,
        name: null,
        roles: [],
    })
    const [result, setResult] = useState(null)
    const [modal, setModal] = useState(false)

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userinfo'))
        setUser({...userInfo})
    }, [])

    function handleOpen() {
        setModal(true)
    }

    function handleClose() {
        setModal(false)
    }

    function onSubmit() {
        handleClose()
        props.history.push(props.location.pathname + `/material/${result}`)
    }

    function handleScan(data) {
        if (data) {
            setResult(data)
        }
    }
    function handleError(err) {
        setResult(null)
        console.error(err)
    }

    return (
        <div>
            <Card centered>
                <Image src={ProfilePic} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{user.name}</Card.Header>
                    <Card.Description>
                        Active Role: Staff
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <p>
                            <Icon name='users' />
                            Role:
                        </p>
                        {
                            user.roles.map((role, idx) => {
                                if (idx + 1 === user.roles.length) {
                                    return role.name
                                }
                                return role.name + ", "
                            }
                            )}
                    </a>
                </Card.Content>
            </Card>
            <div style={{ marginBottom: '5%' }}>
                <Header>Quick Actions:</Header>
                <Modal
                    trigger={<Button onClick={handleOpen} icon='qrcode' content='Read QR Code'></Button>}
                    open={modal}
                    basic
                    dimmer='blurring'
                    onClose={handleClose}
                    size='small'
                >
                    <Modal.Content>
                        <QrReader
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '60%' }}
                        />
                        <Modal.Header style={{ textAlign: 'center' }}>{result}</Modal.Header>
                    </Modal.Content>
                    <Modal.Actions>
                        <ButtonGroup fluid>
                            <Button basic color='green' onClick={onSubmit} content='Confirm' inverted></Button>
                            <Button basic color='red' onClick={handleClose} content='Cancel' inverted></Button>
                        </ButtonGroup>
                    </Modal.Actions>
                </Modal>
            </div>
        </div>
    )
}


export default Staff