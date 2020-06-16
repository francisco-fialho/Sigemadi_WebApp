import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Header, Divider, Button, Statistic } from 'semantic-ui-react'
import ResponseHandler from './ResponseHandler'
import {
    topTenMostUsedMaterialTypesStatistic,
    topTenMostUsedMaterialStatistic,
    damagePerTypeStatistic,
    damagedMaterialStatistic,
    averageTimeToRepairStatistic,
    numberOfRequestedHoursPerTypeStatistic,
    numberOfRequestedHoursPerMaterialStatistic,
    typesUrl,
    requestsPerTypeByDayStatistic,
    requestsPerTypeByMonthStatistic,
    requestsPerTypeByYearStatistic
} from './Utils/Links'
import { SemanticToastContainer } from 'react-semantic-toasts'
import Date from './Utils/Date';
import Filter from './Utils/Filter';
import { MonthInput } from 'semantic-ui-calendar-react';
import MonthCalendar from './Utils/Month';
import YearCalendar from './Utils/Year';


function Statistics(props) {

    const [types, setTypes] = useState([])

    const [topTenUsedMaterialTypes, setTopTenUsedMaterialTypes] = useState([])
    const [topTenUsedMaterial, setTopTenUsedMaterial] = useState([])
    const [damagePerType, setdamagePerType] = useState([])
    const [damagedMaterial, setdamagedMaterial] = useState([])
    const [damageType, setDamageType] = useState('all')

    const [averageTimeToRepair, setAverageTimeToRepair] = useState(null)
    const [numberOfRequestedHoursPerType, setNumberOfRequestedHoursPerType] = useState([])
    const [numberOfRequestedHoursPerMaterial, setNumberOfRequestedHoursPerMaterial] = useState([])
    const [requestedType, setRequestedType] = useState('all')

    const [requestsPerTypeByDay, setRequestsPerTypeByDay] = useState([])
    const [requestedTypeByDay, setRequestedTypeByDay] = useState('all')
    const [dayFrom, setDayFrom] = useState('')
    const [dayTo, setDayTo] = useState('')

    const [requestsPerTypeByMonth, setRequestsPerTypeByMonth] = useState([])
    const [requestedTypeByMonth, setRequestedTypeByMonth] = useState('all')
    const [monthFrom, setMonthFrom] = useState('')
    const [monthTo, setMonthTo] = useState('')

    const [requestsPerTypeByYear, setRequestsPerTypeByYear] = useState([])
    const [requestedTypeByYear, setRequestedTypeByYear] = useState('all')
    const [yearFrom, setYearFrom] = useState('')
    const [yearTo, setYearTo] = useState('')


    useEffect(() => {
        getTypes()
        getTopTenMostUsedMaterialTypes()
        getTopTenMostUsedMaterial()
        getDamagePerType()
        getDamagedMaterial()
        getAverageTimeToRepair()
        getnumberOfRequestedHoursPerType()
        getnumberOfRequestedHoursPerMaterial()
        getRequestsPerTypeByDay()
        getRequestsPerTypeByMonth()
        getRequestsPerTypeByYear()
    }, [])

    function getTypes() {
        axios.get(typesUrl)
            .then(resp => {
                setTypes(resp.data.types)
            }).catch(err => ResponseHandler(err.response))
    }

    function getTopTenMostUsedMaterialTypes() {
        axios.get(topTenMostUsedMaterialTypesStatistic)
            .then(resp => {
                setTopTenUsedMaterialTypes(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getTopTenMostUsedMaterial() {
        axios.get(topTenMostUsedMaterialStatistic)
            .then(resp => {
                setTopTenUsedMaterial(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getDamagePerType() {
        axios.get(damagePerTypeStatistic)
            .then(resp => {
                setdamagePerType(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getDamagedMaterial() {
        let queryString = ''
        if (damageType != 'all') queryString += `?type=${damageType}`
        axios.get(damagedMaterialStatistic + queryString)
            .then(resp => {
                setdamagedMaterial(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getAverageTimeToRepair() {
        axios.get(averageTimeToRepairStatistic)
            .then(resp => {
                setAverageTimeToRepair(resp.data.average)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getnumberOfRequestedHoursPerType() {
        axios.get(numberOfRequestedHoursPerTypeStatistic)
            .then(resp => {
                setNumberOfRequestedHoursPerType(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getnumberOfRequestedHoursPerMaterial() {
        let queryString = ''
        if (requestedType != 'all') queryString += `?type=${requestedType}`
        axios.get(numberOfRequestedHoursPerMaterialStatistic + queryString)
            .then(resp => {
                setNumberOfRequestedHoursPerMaterial(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getRequestsPerTypeByDay() {
        let queryString = ''
        if (requestedTypeByDay != 'all') queryString += `?type=${requestedTypeByDay}`
        if (dayFrom != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `from=${dayFrom}`
        }
        if (dayTo != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `to=${dayTo}`
        }
        axios.get(requestsPerTypeByDayStatistic + queryString)
            .then(resp => {
                setRequestsPerTypeByDay(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getRequestsPerTypeByMonth() {
        let queryString = ''
        if (requestedTypeByMonth != 'all') queryString += `?type=${requestedTypeByMonth}`
        if (monthFrom != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `from=${monthFrom}`
        }
        if (monthTo != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `to=${monthTo}`
        }
        axios.get(requestsPerTypeByMonthStatistic + queryString)
            .then(resp => {
                setRequestsPerTypeByMonth(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    function getRequestsPerTypeByYear() {
        let queryString = ''
        if (requestedTypeByYear != 'all') queryString += `?type=${requestedTypeByYear}`
        if (yearFrom != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `from=${yearFrom}`
        }
        if (yearTo != '') {
            if (queryString.length > 0) queryString += '&'
            else queryString += '?'
            queryString += `to=${yearTo}`
        }
        axios.get(requestsPerTypeByYearStatistic + queryString)
            .then(resp => {
                setRequestsPerTypeByYear(resp.data.data)
            })
            .catch(err => ResponseHandler(err.response))
    }

    return (
        <div >
            <SemanticToastContainer />

            <Header>Statistics</Header>
            <Divider style={{ marginBottom: '5%' }} />


            <div>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getAverageTimeToRepair}></Button>
                <Header size='small'>Average Time to Repair</Header>
                <Statistic>
                    <Statistic.Value>{averageTimeToRepair}</Statistic.Value>
                    <Statistic.Label>Minutes</Statistic.Label>
                </Statistic>
            </div>

            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getTopTenMostUsedMaterialTypes}></Button>
                <Header size='small'>Top Ten Most Used Material Types</Header>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={topTenUsedMaterialTypes}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_times" fill="#c46b5e" />
                </BarChart>
            </div>


            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getTopTenMostUsedMaterial}></Button>
                <Header size='small'>Top Ten Most Used Material</Header>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={topTenUsedMaterial}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_times" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '6.8%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getDamagePerType}></Button>
                <Header size='small'>Damages Per Type</Header>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={damagePerType}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_damages" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getDamagedMaterial}></Button>
                <Header size='small'>Damaged Material</Header>
                <Filter types={types} value={damageType} changeFilter={(value) => { setDamageType(value.id) }} />
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={damagedMaterial}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_damages" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '6.8%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getnumberOfRequestedHoursPerType}></Button>
                <Header size='small'>Number of Requested Hours Per Type</Header>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={numberOfRequestedHoursPerType}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getnumberOfRequestedHoursPerMaterial}></Button>
                <Header size='small'>Number of Requested Hours Per Material</Header>
                <Filter types={types} value={requestedType} changeFilter={(value) => { setRequestedType(value.id) }} />
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={numberOfRequestedHoursPerMaterial}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getRequestsPerTypeByDay}></Button>
                <Header size='small'>Requests Per Type By Day</Header>
                <Button content='Reset' floated='right' onClick={() => { setDayTo(''); setDayFrom(''); setRequestedTypeByDay('all') }} />
                <Filter types={types} value={requestedTypeByDay} changeFilter={(value) => { setRequestedTypeByDay(value.id) }} />
                From: <Date setDay={(value) => setDayFrom(value)} date={dayFrom}></Date>
                To: <Date setDay={(value) => setDayTo(value)} date={dayTo}></Date>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={requestsPerTypeByDay}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_requests" fill="#c46b5e" />
                </BarChart>
            </div>

            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getRequestsPerTypeByMonth}></Button>
                <Header size='small'>Requests Per Type By Month</Header>
                <Button content='Reset' floated='right' onClick={() => { setMonthTo(''); setMonthFrom(''); setRequestedTypeByMonth('all') }} />
                <Filter types={types} value={requestedTypeByMonth} changeFilter={(value) => { setRequestedTypeByMonth(value.id) }} />
                From: <MonthCalendar setMonth={(value) => setMonthFrom(value)} date={monthFrom}></MonthCalendar>
                To: <MonthCalendar setMonth={(value) => setMonthTo(value)} date={monthTo}></MonthCalendar>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={requestsPerTypeByMonth}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_requests" fill="#c46b5e" />
                </BarChart>
            </div>


            <div style={{ marginTop: '5%' }}>
                <Button style={{ float: 'right' }} icon='refresh' circular basic onClick={getRequestsPerTypeByYear}></Button>
                <Header size='small'>Requests Per Type By Year</Header>
                <Button content='Reset' floated='right' onClick={() => { setYearTo(''); setYearFrom(''); setRequestedTypeByYear('all') }} />
                <Filter types={types} value={requestedTypeByYear} changeFilter={(value) => { setRequestedTypeByYear(value.id) }} />
                From: <YearCalendar setYear={(value) => setYearFrom(value)} date={yearFrom}></YearCalendar>
                To: <YearCalendar setYear={(value) => setYearTo(value)} date={yearTo}></YearCalendar>
                <BarChart
                    width={700}
                    height={300}
                    style={{ marginLeft: 'auto',marginRight: 'auto'}}
                    data={requestsPerTypeByYear}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nr_requests" fill="#c46b5e" />
                </BarChart>
            </div>
        </div>
    )
}

export default Statistics