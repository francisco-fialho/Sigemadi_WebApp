import React, { useEffect, useState } from 'react'
import Date_Time from '../Utils/DateTime'
import { Header, Input, Button, List, Divider } from 'semantic-ui-react'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'
import Filter from '../Utils/Filter'
import axios from 'axios'
import { subjectsUrl, reservationsUrl } from '../Links'


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
        setUser(JSON.parse(sessionStorage.getItem('userinfo')))

        axios.get(subjectsUrl)
            .then(resp => {
                setSubjects(resp.data['subjects'])
            })
            .catch(err => setError(Response_Handler(err.response)))

        const material = JSON.parse(localStorage.getItem('reservation'))
        // if (material === null) {
        //     toast({
        //         type: 'error',
        //         title: 'Something Went Wrong',
        //         time: 2000,
        //         size: 'mini',
        //         description: 'Please select the material again'
        //     })
        //     setTimeout(() => { props.history.push('/auth/teacher') }, 2000)
        // }

        setMaterials(material)
    }, [])


    function setDayTime(datetime) {
        const [date, time] = datetime.split(" ")
        setDate(date)
        setTime(time)
    }

    //TENHO QUE IR BUSCAR CADA MATERIAL NAO UNITARIO PARA PODER METER O MAX = AVAILABLE OU METO UM CERTO VALOR 10?


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

    function changeFilter(value) {
        if (value.id != 'all') {
            setSubject(value)
        }
    }


    function onSubmit() {
        if (date === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert a date'
            })
        }
        if (time === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert an hour'
            })
        }
        if (subject === null) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert a subject'
            })
        }
        if (groups === '') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Insert number of groups'
            })
        }

        //separar a quantidade no sua propria propriedade em vez de ser por virgula


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

        const button = document.getElementById('reservation')

        if (verifyQuantity) {
            // if(request!=null){

            //     //SEMPRE VAMOS TER O ADICIONAR A RESERVA
            // }
            // else{
            //     //VERIFICAR COMO É QUE A DATA VAI REPRESENTADA
            // }

            button.disabled = true
            axios.post(reservationsUrl, { 'user_id': user.id, 'subject': subject.id, 'date': `${date} ${time}`, 'groups': groups, 'materials': material })
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => {
                        localStorage.removeItem('reservation')
                        props.history.push('/auth/teacher/reservation')
                    }, 2000)
                })
                .catch(err => {
                    button.disabled = false
                    Response_Handler(err.response)
                })
        }
    }

    function onChangeGroups(quantity) {
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

    function buildMaterialInfo() {
        if (!materials) return
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
                            <Input size='small' onChange={(event, object) => onChangeQuantity(material, object.value)} type="number" style={{ textAlign: 'center' }} required placeholder="1" min={MIN} max={MAX}></Input>
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
                    <div>
                        <Header>Finalize Reservation</Header>
                        <Divider />
                        {
                            props.newReservation ?
                                <div>
                                    Groups Quantity:
                                <Input size='small' onChange={(event, object) => onChangeGroups(object.value)} type="number" required placeholder="1" min={MIN} max={GROUP_MAX} style={{ textAlign: 'center', width: '15%', marginRight: '15%' }}></Input>
                                Subjects:
                            <div style={{ display: 'inline-block' }}>
                                        <Filter changeFilter={changeFilter} name='subject' types={subjects} value={findSubject()} />
                                    </div>
                                    <Header size='small' style={{ marginTop: '5%' }}>Select a Date and Hour:</Header>
                                    <Date_Time setDayTime={setDayTime} />
                                </div>
                                : null
                        }
                        <Divider />
                        <Button id='reservation' basic size='large' style={{ display: 'inline-block', float: 'right' }} onClick={onSubmit} icon='edit alternate' content='Reserve' />

                        <div style={{ display: 'block', marginTop: '5%' }}>
                            <Header size='medium'>Material:</Header>
                            {buildMaterialInfo(this)}
                        </div>
                    </div>
            }
        </div>
    )
}
export default Checkout_Reservation