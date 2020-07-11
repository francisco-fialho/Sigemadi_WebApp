import React, { useEffect, useState } from 'react'
import ProfilePic from '../../assets/molly.png'
import { Card, Button, Header, Image, Divider, Message, Icon } from 'semantic-ui-react'
import { reservationUrl } from '../Utils/Links'
import axios from 'axios'
import ResponseHandler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts'


function Reservation_Details(props) {

    const [request, setRequest] = useState({
        materials: []
    })

    const [error, setError] = useState(null)
    const [disableButton, setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const id = props.match.params['id']
        httpsAxios.get(reservationUrl.replace(':id', id))
            .then(resp => {
                setRequest({
                    ...resp.data,
                    id: id
                })
            })
            .catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }, [])

    function deleteReservation() {
        setDisableButton(true)
        httpsAxios.delete(reservationUrl.replace(':id', request.id))
            .then(resp => {
                ResponseHandler(resp)
                setTimeout(() => props.history.push(props.location.pathname.replace(`/${request.id}`, '')), 3000)
            }).catch(err => {
                setDisableButton(false)
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    !request.id ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Card style={{ float: 'right' }}>
                                <Image src={`data:image/jpeg;base64,${request.user_photo}`} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{request.user_name}</Card.Header>
                                    <Card.Meta>{request.user_id}</Card.Meta>
                                </Card.Content>
                                <Card.Content extra>
                                    {request.subject} | {request.date} | {request.hour}
                                    <div>
                                        Duration: {request.duration}
                                    </div>
                                    <Divider />
                                    <Header size='small'>Groups: {request.nr_groups} </Header>
                                </Card.Content>
                            </Card>

                            <Button id='delete' disabled={disableButton} floated='right' color='red' onClick={deleteReservation} content='Delete Reservation' icon='delete'></Button>
                            <Header style={{ marginLeft: '13%' }}>Material: </Header>

                            <Divider />
                            <div style={{ display: 'inline-block' }}>
                                {
                                    request.materials.map(m => {
                                        return (
                                            <Header size='small' key={m.type}>{m.type_name + ' | ' + m.type_id + ' | ' + 'Quantity: ' + m.quantity}</Header>
                                        )
                                    })
                                }
                            </div>
                        </div>
            }

        </div>
    )
}
export default Reservation_Details