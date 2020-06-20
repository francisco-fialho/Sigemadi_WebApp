import React, { useEffect, useState } from 'react'
import DateTime from '../Utils/DateTime'
import { Header, Input, Button, List, Divider, Message, Icon } from 'semantic-ui-react'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'
import Filter from '../Utils/Filter'
import axios from 'axios'
import { subjectsUrl, reservationsUrl } from '../Utils/Links'


const MAX = '10'
const MIN = '1'
const GROUP_MAX = '15'
function Checkout_Reservation(props) {

    const [date, setDate] = useState('')
    const [user, setUser] = useState(null)
    const [time, setTime] = useState('')
    const [materials, setMaterials] = useState([])
    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState(null)
    const [groups, setGroups] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userinfo')))

        axios.get(subjectsUrl)
            .then(resp => {
                setSubjects(resp.data['subjects'])
            })
            .catch(err => setError(Response_Handler(err.response)))

        const material = JSON.parse(localStorage.getItem('reservation'))
        if (material === null) {
            toast({
                type: 'error',
                title: 'Something Went Wrong',
                time: 2000,
                size: 'mini',
                description: 'Please select the material again!'
            })
            setTimeout(() => { props.history.push(props.location.pathname.replace('checkout', '')) }, 3000)
        }
        else
            setMaterials(material)
    }, [])


    function onChangeQuantity(material, quantity) {
        if (parseInt(quantity) < parseInt(MIN)) quantity = MIN
        if (parseInt(quantity) > parseInt(MAX)) quantity = MAX
        let materialList = materials
        const idx = materialList.findIndex(m => m.id === material.id)
        materialList[idx] = {
            ...materialList[idx],
            quantity: quantity
        }
        setMaterials(materialList)
    }

    function onChangeFilter(value) {
        if (value.id != 'all') {
            setSubject(value)
        }
    }

    function verifyInformation() {
        if (date === '') {
            toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert a date'
            })
            return false
        }
        if (time === '') {
            toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert an hour'
            })
            return false
        }
        if (subject === null) {
            toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert a subject'
            })
            return false
        }
        if (groups === '') {
            toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert number of groups'
            })
            return false
        }
        return true
    }


    function onSubmit() {
        const verified = verifyInformation()
        const button = document.getElementById('reservation')

        let verifyQuantity = true
        const material = materials.map(m => {
            if (m.quantity === undefined) {
                verifyQuantity = false
                return toast({
                    type: 'warning',
                    title: 'Missing Information',
                    time: 2000,
                    size: 'mini',
                    description: `Insert a quantity for the material ${m.name}`
                })
            }
            return {
                'type': m.id,
                'quantity': m.quantity
            }
        })

        if (verifyQuantity && verified) {
            button.disabled = true
            axios.post(reservationsUrl, { 'user_id': user.id, 'subject': subject.id, 'date': `${date} ${time}`, 'groups': groups, 'materials': material })
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => {
                        localStorage.removeItem('reservation')
                        props.history.push('/auth/teacher/reservation')
                    }, 3000)
                })
                .catch(err => {
                    button.disabled = false
                    Response_Handler(err.response)
                })
        }
    }

    function setDayTime(datetime) {
        const [date, time] = datetime.split(" ")
        setDate(date)
        setTime(time)
    }
    
    function onChangeGroupQuantity(quantity) {
        if (parseInt(quantity) < parseInt(MIN)) quantity = MIN
        if (parseInt(quantity) > parseInt(GROUP_MAX)) quantity = GROUP_MAX
        setGroups(quantity)
    }

    function findSubject() {
        if (subject === null) {
            return 'all'
        }
        return subject.id
    }

    function createMaterialInfo() {
        return (<List size='large' divided>
            {
                materials.map(material => {
                    return <List.Item key={material.id}>
                        <List.Content floated='left'>
                            <List.Header>{material.name}</List.Header>
                        </List.Content>
                        <List.Content floated='right'>
                            <List.Description >
                                Quantity per Group:
                            <Input size='small' onChange={(event, object) => onChangeQuantity(material, object.value)} type="number" style={{ textAlign: 'center' }} required min={MIN} max={MAX}></Input>
                            </List.Description>
                        </List.Content>
                    </List.Item>

                })
            }
        </List>
        )
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    materials.length == 0 ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <div>
                            <Header>Finalize Reservation</Header>
                            <Divider />
                            {
                                props.newReservation ?
                                    <div>
                                        Groups Quantity:
                                        <Input size='small' onChange={(event, object) => onChangeGroupQuantity(object.value)} type="number" required min={MIN} max={GROUP_MAX} style={{ textAlign: 'center', width: '15%', marginRight: '15%' }}></Input>
                                        Select a Subject:
                                        <div style={{ display: 'inline-block' }}>
                                            <Filter changeFilter={onChangeFilter} name='subject' types={subjects} value={findSubject()} optionAll={findSubject() =='all'}/>
                                        </div>
                                        <Header size='small' style={{ marginTop: '5%' }}>Select a Date and Hour:</Header>
                                        <DateTime setDayTime={setDayTime} />
                                    </div>
                                    : null
                            }
                            <Divider />
                            <Button id='reservation' size='large' style={{ display: 'inline-block', float: 'right' }} onClick={onSubmit} icon='edit alternate' content='Reserve' />

                            <div style={{ display: 'block', marginTop: '5%' }}>
                                <Header size='medium'>Material:</Header>
                                {createMaterialInfo(this)}
                            </div>
                        </div>
            }
        </div>
    )
}
export default Checkout_Reservation