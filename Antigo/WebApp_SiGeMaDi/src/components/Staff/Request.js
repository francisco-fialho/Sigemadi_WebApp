import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Date from '../Utils/Date'
import { Header, Button, Input, Message, Divider, Grid, Card, Icon, Image } from 'semantic-ui-react'
import Filter from '../Utils/Filter'
import { requestByUserUrl, requestsUrl } from '../Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../ResponseHandler'

const requestTypes = [{ name: 'Ativos', id: true }, { name: 'Antigos', id: false }]

function Request(props) {

    const scrollObserve = useRef()

    const [requests, setRequests] = useState([])
    const [userId, setUserId] = useState(null)
    const [date, setDate] = useState('')
    const [requestType, setRequestType] = useState({ type: '', id: '' })

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (props.location && props.location.search) {
            const querystring = new URLSearchParams(props.location.search)
            const entries = querystring.entries()
            let next = entries.next()
            let filters = []
            do {
                filters.push({ name: next.value[0], value: next.value[1] })
                next = entries.next()
            } while (!next.done)

            const userid = filters.find(r => r.name === 'user')
            let active = filters.find(r => r.name === 'active')
            let date = filters.find(r => r.name === 'date')

            let value = 'all'
            if (active != undefined) {
                value = active.value
            }
            active = {
                type: 'type',
                id: value
            }
            setRequestType(active)

            if (userid != undefined) {
                setUserId(userid.value)
                document.getElementById("searchUser").value = userid.value
            }
            else {
                if (date != undefined) {
                    setDate(date.value)
                }
            }
        }

        else {
            setRequestType({ type: 'type', id: 'all' })
        }

        intersectionObserver.observe(scrollObserve.current)
        return () => {
            intersectionObserver.disconnect()
        }

    }, [])

    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    })

    useEffect(() => {
        if (scrollRadio >= 0 && moreData && requestType.id != '' && !showLoading) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            if (userId != null) searchUserRequests(userId, requestType.id, newPage, requests)
            else searchRequest(requestType.id, date, newPage, requests)
        }
        if (date != '' || (requestType.id != '' && requestType.id != 'all') || userId != null) {
            const resetButton = document.getElementById("resetbutton")
            const visible = "visible"
            resetButton.style.visibility = visible
        }
    }, [scrollRadio])


    function setDay(date) {
        const resetButton = document.getElementById("resetbutton")
        resetButton.style.visibility = "visible"
        setDate(date)
    }

    function newRequest() {
        props.history.push('/auth/staff/newrequest')
    }

    function onClickRequest(id) {
        props.history.push(props.location.pathname + `/${id}`)
    }


    function searchUserRequests(id, requestState, pageNumber, requestsAdded) {
        let searchUrl = `?user=${id}`
        if (requestState != 'all')
            searchUrl += `&active=${requestState}`

        axios.get(requestByUserUrl.replace(":id", id) + `?page=${pageNumber}`)
            .then(resp => {

                let old = resp.data['older'] == undefined ? false : resp.data['older'].length > 0
                let curr = resp.data['current'] == undefined ? false : true

                if (((requestState === 'all' && !old && !curr) || (requestState === 'true' && !curr) || (requestState === 'false' && !old)) && requestsAdded.length === 0) {
                    return toast({
                        type: 'error',
                        title: 'Something went wrong',
                        time: 2000,
                        size: 'mini',
                        description: 'There are no results for the specified parameters'
                    })
                }

                if (requestState === 'all') {
                    let reqs = requestsAdded
                    reqs.push(...resp.data['older'])
                    if (curr) {
                        reqs.push(resp.data['current'])
                    }
                    setRequests(reqs)
                }
                else if (requestState === 'true') {
                    let reqs = requestsAdded
                    reqs.push(resp.data['current'])
                    setRequests(reqs)
                }
                else {
                    let reqs = requestsAdded
                    reqs.push(...resp.data['older'])
                    setRequests(reqs)
                }

                setShowLoading(false)

                props.history.push({
                    pathname: props.location.pathname,
                    search: searchUrl
                })

            })
            .catch(err => setError(Response_Handler(err.response)))
    }

    function searchRequest(requestState, date, pageNumber, requestsAdded) {

        let url = '?'
        if (date != '') {
            url += `date=${date}`
        }
        if (requestState != 'all') {
            if (url != '?') url += '&'
            url += `active=${requestState}`
        }
        const searchUrl = url

        if (url != '?') url += '&'
        url += `page=${pageNumber}`

        axios.get(requestsUrl + url)
            .then(resp => {
                const data = resp.data['requests']
                if (data.length === 0 && requestsAdded.length === 0) {
                    return toast({
                        type: 'error',
                        title: 'Something went wrong',
                        time: 2000,
                        size: 'mini',
                        description: 'There are no results for the specified parameters'
                    })
                }

                if (data.length === 0) setMoreData(false)

                const newRequests = requestsAdded
                newRequests.push(...data)
                setRequests(newRequests)
                setShowLoading(false)

                props.history.push({
                    pathname: props.location.pathname,
                    search: searchUrl
                })
            })
            .catch(err => setError(Response_Handler(err.response)))
    }




    function resetSearch() {
        const resetButton = document.getElementById("resetbutton")
        resetButton.style.visibility = "hidden"
        props.history.push(props.location.pathname)
        document.getElementById("searchUser").value = ""

        const type = { type: 'type', id: 'all' }
        const newDate = ''
        const newPage = 1
        setPage(newPage)
        setDate(newDate)
        setMoreData(true)
        setRequestType(type)
        setUserId(null)
        setRequests([])
        searchRequest(type.id, newDate, newPage, [])
    }

    function onChangeOption(value) {
        setRequestType(value)
    }


    function onClickFilters() {
        const newPage = 1
        setPage(newPage)
        setMoreData(true)
        if (userId != null) {
            searchUserRequests(userId, requestType.id, newPage, [])
        }
        else {
            searchRequest(requestType.id, date, newPage, [])
        }
        const resetButton = document.getElementById("resetbutton")
        const visible = "visible"
        resetButton.style.visibility = visible
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
                        <Header size='medium'>Requests:</Header>

                        <Button size='large' basic style={{ marginBottom: '2%' }} onClick={newRequest} icon='file alternate' content='New Request' />

                        <div style={{ display: 'block' }}>
                            <Button size='large' basic style={{ float: 'right', visibility: 'hidden' }} id="resetbutton" content='Reset' onClick={resetSearch}></Button>
                            <Button size='large' basic style={{ float: 'right' }} content='Search' icon='search' onClick={onClickFilters}></Button>
                        Filter By Day:
                        <div style={{ display: 'inline-block' }}>
                                <Date date={date} setDay={setDay}></Date>
                            </div>
                            <Input size='mini' id='searchUser' onChange={(event, object) => setUserId(object.value)} type="text" placeholder="Introduce student number" icon='users' style={{ float: 'right' }} />

                            <div style={{ display: 'block', marginBottom: '1%', float: 'left' }}>
                                <Filter changeFilter={onChangeOption} name="type" title=' ' types={requestTypes} value={requestType.id} />
                            </div>
                        </div>
                        <Divider />
                        <div style={{ display: 'block' }}>
                            <Grid columns={4} style={style}>
                                {
                                    requests.map(request => {
                                        return <Grid.Column >
                                            <Card key={request.id}>
                                                <Image src={`data:image/jpeg;base64,${request.user_photo}`} wrapped ui={false} />
                                                <Card.Header>
                                                    {request.id}
                                                </Card.Header>
                                                <Card.Description>
                                                    {request.user_name} | {request.user_id}
                                                </Card.Description>
                                                <Card.Description>{request.start_date}</Card.Description>
                                                <Card.Content extra>
                                                    <Button fluid content='See Request' icon='address card' onClick={() => onClickRequest(request.id)}></Button>
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>

                                    })
                                }
                            </Grid>
                            <div ref={scrollObserve}></div>

                            {
                                showLoading ? <Message size='small'><Icon name='circle notch' loading />Loading...</Message> : null
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default Request  