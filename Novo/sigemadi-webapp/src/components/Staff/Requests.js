import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Date from '../Utils/Date'
import { Header, Button, Input, Message, Divider, Grid, Card, Icon, Image, Label } from 'semantic-ui-react'
import Filter from '../Utils/Filter'
import { requestByUserUrl, requestsUrl } from '../Utils/Links'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../ResponseHandler'

const requestTypes = [{ name: 'Active', id: true }, { name: 'Old', id: false }]

function Request(props) {

    const scrollObserve = useRef()

    const [requests, setRequests] = useState([])
    const [userId, setUserId] = useState('')
    const [date, setDate] = useState('')
    const [reset, setReset] = useState('hidden')
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
            setReset('visible')

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

    const scrollOptions = {
        root: document.querySelector('#requests'),
        rootMargin: '5px',
        threshold: 1.0
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    }, scrollOptions)

    useEffect(() => {
        if (scrollRadio >= 0 && moreData && requestType.id != '' && !showLoading && !error) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            if (userId != '') searchUserRequests(userId, requestType.id, newPage, requests)
            else searchRequest(requestType.id, date, newPage, requests)
        }
    }, [scrollRadio])



    function searchUserRequests(id, requestState, pageNumber, requestsAdded) {
        let searchUrl = `?user=${id}`
        if (requestState != 'all')
            searchUrl += `&active=${requestState}`

        props.history.push({
            pathname: props.location.pathname,
            search: searchUrl
        })

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

        props.history.push({
            pathname: props.location.pathname,
            search: searchUrl
        })

        axios.get(requestsUrl + url)
            .then(resp => {
                const data = resp.data['requests']
                if (data.length === 0 && requestsAdded.length === 0) {
                    setShowLoading(false)
                    setRequests(data)
                    setMoreData(false)
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

            })
            .catch(err => setError(Response_Handler(err.response)))
    }


    function setDay(date) {
        setDate(date)
    }

    function newRequest() {
        props.history.push('/auth/staff/newrequest/material')
    }

    function onClickRequest(id) {
        props.history.push(props.location.pathname + `/${id}`)
    }



    function resetSearch() {
        props.history.push(props.location.pathname)
        document.getElementById("searchUser").value = ""

        const type = { type: 'type', id: 'all' }
        const newDate = ''
        const newPage = 1
        setPage(newPage)
        setDate(newDate)
        setMoreData(true)
        setRequestType(type)
        setUserId('')
        setRequests([])
        setShowLoading(true)
        setReset('hidden')
        searchRequest(type.id, newDate, newPage, [])
    }

    function onSubmitFilters() {
        if (requestType.id == 'all' && userId == '' && date == '') return
        const newPage = 1
        setPage(newPage)
        setMoreData(true)
        setShowLoading(true)
        setReset('visible')
        if (userId != '') {
            setDate('')
            searchUserRequests(userId, requestType.id, newPage, [])
        }
        else {
            searchRequest(requestType.id, date, newPage, [])
        }
    }

    function onChangeType(value) {
        if (value.id != 'all')
            setRequestType(value)
    }

    const style = {
        height: 30,
        margin: 6,
        padding: 8
    }

    function buildRequestList() {
        return requests.map(request => {
            const requestInfo = (<Grid.Column key={request.id}>
                <Card>
                    <Image
                        src={`data:image/jpeg;base64,${request.user_photo}`}
                        label={request.close_hour ? { color: 'red', content: 'Ended', ribbon: true, size: 'large' } : null}
                        wrapped ui={false} />
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
            </Grid.Column>)

            return requestInfo
        })
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
                            Filter By Day:
                        <div style={{ display: 'inline-block' }}>
                                <Date date={date} setDay={setDay}></Date>
                            </div>
                            <Input size='mini' id='searchUser' onChange={(event, object) => setUserId(object.value)} type="text" placeholder="Introduce student number" icon='users' style={{ float: 'right' }} />

                            <div style={{ display: 'block', marginBottom: '1%', float: 'left' }}>
                                <Filter changeFilter={onChangeType} name="type" title='Type' types={requestTypes} value={requestType.id} optionAll={requestType.id == 'all'} />
                            </div>
                        </div>
                        <div style={{ display: 'block', marginTop: '2%', marginLeft: '6%', }}>
                            <Button size='large' basic content='Search' icon='search' onClick={onSubmitFilters} />
                            <Button size='large' basic style={{ visibility: reset }} id="resetbutton" content='Reset' onClick={resetSearch}></Button>
                        </div>
                        <Divider />
                        <div style={{ display: 'block' }}>
                            <Grid columns={4} id='requests' style={style}>
                                {
                                    buildRequestList()
                                }
                                <div ref={scrollObserve}></div>
                                {
                                    showLoading ? <Grid.Column><Message size='small'><Icon name='circle notch' loading />Loading...</Message></Grid.Column> : null
                                }
                            </Grid>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Request