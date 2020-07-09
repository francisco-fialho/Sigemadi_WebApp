import React, { useState, useEffect, useRef } from 'react'
import Option from '../Utils/Option'
import { Header, Input, Button, Grid, Card, Image, Divider, Message, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { usersUrl, rolesUrl } from '../Utils/Links'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

function Users_Roles(props) {

    const scrollObserve = useRef()

    const [persons, setPersons] = useState([])
    const [filter_role, setFilter_Role] = useState(null)
    const [filter_id, setFilter_Id] = useState(null)
    const [roles, setRoles] = useState([])
    const [reset, setReset] = useState('collapse')

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [error, setError] = useState(null)
    const [editing, setEditing] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })



    useEffect(() => {
        setFilter_Id('')
        setFilter_Role('')
        if (props.location && props.location.search) {
            const querystring = new URLSearchParams(props.location.search)
            const entries = querystring.entries()
            let next = entries.next()

            do {
                const type = next.value[0]
                if (type === 'role') {
                    setFilter_Role(next.value[1])
                }
                if (type === 'id') {
                    setFilter_Id(next.value[1])
                    document.getElementById("searchProfile").value = next.value[1]
                }
                next = entries.next()
            } while (!next.done)
            setReset('visible')
        }
        httpsAxios.get(rolesUrl)
            .then(resp => {
                setRoles(resp.data['roles'].filter(r => r !== 'student' && r !== 'staff'))
            }).catch(err => Response_Handler(err.response))


        intersectionObserver.observe(scrollObserve.current)
        return () => {
            intersectionObserver.disconnect()
        }

    }, [])

    const scrollOptions = {
        root: document.querySelector('#users'),
        rootMargin: '5px',
        threshold: 1.0
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    }, scrollOptions)

    useEffect(() => {

        if (scrollRadio >= 0 && moreData && !showLoading && !editing && (filter_id != null || filter_role != null)) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            searchPersons(filter_id, filter_role, newPage, persons)
        }
    }, [scrollRadio, filter_id, filter_role])



    function searchPersons(id, role, page, personsAdded) {
        if (role == 'student' || id.slice(0, 1) === 'A') {
            setShowLoading(false)
            return toast({
                title: 'Invalid Parameter',
                type: 'error',
                size: 'mini',
                time: 2000,
                description: 'Insert a diferent role or a diferent user'
            })
        }

        let search = buildSearchUrl(id, role)

        let requestUrl = search
        if (requestUrl == '') requestUrl += '?role=administrator,teacher,lab_responsible,technician'
        requestUrl += `&page=${page}`

        httpsAxios.get(usersUrl + requestUrl)
            .then(resp => {
                const data = resp.data['users']

                if (personsAdded.length === 0 && data.length === 0) {
                    setPersons(data)
                    setMoreData(false)
                    setShowLoading(false)
                    return toast({
                        type: 'warning',
                        title: 'Something Went Wrong',
                        time: 2000,
                        size: 'mini',
                        description: 'There are no results for the specified parameters'
                    })
                }

                if (data.length === 0) setMoreData(false)

                const newPersons = personsAdded
                newPersons.push(...data)
                setPersons(newPersons)
                setShowLoading(false)

                if (search != '')
                    props.history.push({
                        pathname: props.location.pathname,
                        search: search
                    })

            }).catch(err => setError(Response_Handler(err.response)))
    }


    function buildSearchUrl(id, role) {
        let search = '?'
        if (id != '')
            search += `id=${id}`
        if (role != '') {
            if (search.length > 1) {
                search += '&'
            }
            search += `role=${role}`
        }
        if (search === '?')
            search = ''
        return search
    }


    function changeFilter(filter) {
        if (filter != 'all') {
            setFilter_Role(filter)
            setEditing(true)
        }
    }

    function resetFilter(event) {
        event.preventDefault()
        const id = ''
        const role = ''
        const newPage = 1
        setShowLoading(true)
        setPage(newPage)
        setFilter_Id(id)
        setFilter_Role(role)
        setMoreData(true)
        searchPersons(id, role, newPage, [])
        setReset('hidden')
        props.history.push(props.location.pathname)
        document.getElementById("searchProfile").value = ""
    }

    function findFilter() {
        if (filter_role != '') {
            return filter_role
        }
        return 'all'
    }

    function defineRoles(id) {
        props.history.push(`/auth/admin/usersroles/${id}`)
    }

    function searchProfile() {
        if (filter_id != '' || filter_role != '') {
            const newPage = 1
            setEditing(false)
            setPage(newPage)
            setMoreData(true)
            setShowLoading(true)
            setReset('visible')
            searchPersons(filter_id, filter_role, newPage, [])
        }
    }

    function createUsersTable() {
        return persons.map(person => {
            return (
                <Grid.Column key={person.id}>
                    <Card centered >
                        <Image src={`data:image/jpeg;base64,${person.photo}`} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>{person.user_name}</Card.Header>
                            <Card.Description>{person.id}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button fluid content='Change Roles' icon='address card' onClick={() => defineRoles(person.id)}></Button>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            )
        })
    }

    const style = {
        height: 30,
        margin: 6,
        padding: 8
    }


    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>

                        <Header size='medium'>Users:</Header>
                        <Input size='mini' style={{ float: 'right' }} icon='users' id='searchProfile' onChange={(event, object) => { setEditing(true); setFilter_Id(object.value) }} iconPosition='left' placeholder='Introduce user number...' />
                        <div style={{ display: 'block', float: 'left', marginTop: '1%' }}>
                            Filter by Role:
                        <Option values={roles} value={findFilter()} changeOption={changeFilter} defaultValue={findFilter() == 'all' ? 'All' : null} />
                        </div>
                        <div style={{ display: 'block', marginLeft: '6%', }}>
                            <Button size='large' basic onClick={searchProfile} icon='search' content='Search' />
                            <Button size='large' id="reset_filter" basic onClick={resetFilter} style={{ visibility: reset, marginLeft: '1%', marginTop: '0.5%' }} content='Reset' />
                        </div>
                        <Divider />

                        <Grid columns={6} id='users' style={style}>
                            {
                                persons.length==0 && !showLoading ? <Message>There are no results</Message> : createUsersTable()
                            }
                            <div ref={scrollObserve}></div>
                            {
                                showLoading ? <Grid.Column><Message size='small'><Icon name='circle notch' loading />Loading...</Message></Grid.Column> : null
                            }
                        </Grid>
                    </div>
            }

        </div>
    )
}

export default Users_Roles