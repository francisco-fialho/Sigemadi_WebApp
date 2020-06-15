import React, { useEffect, useState } from 'react'
import ProfilePic from '../../assets/molly.png'
import { Card, Button, Header, Image, Divider, Message, Icon } from 'semantic-ui-react'
import { reservationUrl } from '../Links'
import axios from 'axios'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts'


function Reservation_Details(props) {

    const [request, setRequest] = useState({
        materials: []
    })

    const [error, setError] = useState(null)


    useEffect(() => {
        const id = props.match.params['id']
        axios.get(reservationUrl.replace(':id', id))
            .then(resp => {
                setRequest({
                    ...resp.data,
                    id: id
                })
            })
            .catch(err => setError(Response_Handler(err.response)))
    }, [])



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
                                    <Divider />
                                    <Header size='small'>Groups: {request.nr_groups} </Header>
                                </Card.Content>
                            </Card>

                            <Header >Material: </Header>
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