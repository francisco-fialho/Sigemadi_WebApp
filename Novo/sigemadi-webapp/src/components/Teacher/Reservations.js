import React, { useState, useEffect } from 'react'
import { Button, Header, List, Divider } from 'semantic-ui-react'
import { reservationsUserUrl } from '../Utils/Links'
import axios from 'axios'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts'

function Reservation(props) {

    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = JSON.parse(sessionStorage.getItem('userinfo')).id
        axios.get(reservationsUserUrl.replace(':id', id))
            .then(resp => {
                setReservations(resp.data['reservations'])
            })
            .catch(err => setError(Response_Handler(err.response)))
    }, [])

    function newRequest() {
        props.history.push('/auth/teacher/newreservation/types')
    }


    function onClickRequest(id) {
        props.history.push(props.location.pathname + `/${id}`)
    }


    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>
                        <Header size='medium'>Reservations</Header>
                        <Button basic size='large' onClick={newRequest} icon='file alternate' content='New Reservation' />
                        <div style={{ display: 'block' }}>
                            <Divider />
                            <List selection>
                                {
                                    reservations.length === 0 ? <Header>There is no Active Reservations</Header> :
                                        reservations.map(request => {
                                            return <List.Item key={request.id} onClick={() => onClickRequest(request.id)}>
                                                <List.Content>
                                                    <List.Header>{request.id}</List.Header>
                                                    <List.Description>{request.subject} | {request.date} | {request.hour} </List.Description>
                                                </List.Content>
                                            </List.Item>

                                        })
                                }
                            </List>
                        </div>
                    </div>
            }

        </div>
    )
}

export default Reservation