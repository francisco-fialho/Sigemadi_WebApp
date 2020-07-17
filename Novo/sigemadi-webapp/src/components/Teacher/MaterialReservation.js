import React, { useEffect, useState } from 'react'
import Filter from '../Utils/Filter'
import { Header, Button, Divider, Card, Grid } from "semantic-ui-react"
import { typesUrl, sci_areasUrl, subjectsUrl, sci_areaUrl, subjectUrl } from '../Utils/Links'
import axios from 'axios'
import ResponseHandler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts'

function Material_Reservation(props) {

    const [materialTypes, setTypes] = useState([])
    const [checkboxes, setCheckboxes] = useState([])
    const [filters, setFilters] = useState([])
    const [subjects, setSubjects] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [searchedtypes, setSearchedTypes] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [error, setError] = useState(null)
    const [reset, setReset] = useState('collapse')
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }



    useEffect(() => {
        let material = JSON.parse(localStorage.getItem('reservation'))
        if (material == null) {
            material = []
        }
        else {
            let selected = selectedTypes
            selected.push(...material)
            setSelectedTypes(selected)
        }
        searchDefaultFilters(material)

    }, [])


    function applyFilters(filtersUrl) {
        const lastFilter = filtersUrl[filtersUrl.length - 1]
        const filter_area = filters.find(f => f.type == 'sci_area')
        const filter_subject = filters.find(f => f.type == 'subject')

        if (lastFilter.type === 'sci_area') {
            searchSciArea(lastFilter, filter_subject, filtersUrl)

        }
        else if (lastFilter.type === 'subject') {
            searchSubjects(lastFilter, filter_area, filtersUrl)
        }
    }

    function searchSciArea(lastFilter, filter_subject) {
        httpsAxios.get(sci_areaUrl.replace(':id', lastFilter.id))
            .then(resp => {

                let subj = resp.data['subjects']
                let types = resp.data['types']

                if (filter_subject != undefined) {
                    subj = intersect(subj, [filter_subject])
                    if (subj.length == 0) subj = [filter_subject]
                    types = intersect(types, searchedtypes)
                }

                setSubjects(subj)
                setSearchedTypes(types)

            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }

    function searchSubjects(lastFilter, filter_area) {
        httpsAxios.get(subjectUrl.replace(':id', lastFilter.id))
            .then(resp_subject => {

                let sci_id = resp_subject.data['sci_area'].id
                if (filter_area != undefined) {
                    sci_id = filter_area.id
                }
                httpsAxios.get(sci_areaUrl.replace(':id', sci_id))
                    .then(resp_area => {
                        let areas = [resp_subject.data['sci_area']]
                        let types = intersect(resp_subject.data['types'], resp_area.data['types'])

                        if (filter_area != undefined) {
                            areas = intersect(areas, [filter_area])
                            if (areas.length == 0) areas = [filter_area]
                        }

                        setSci_Areas(areas)
                        setSearchedTypes(types)

                    }).catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }


    function intersect(array1, array2) {
        return array1.filter(a => array2.find(b => b.id == a.id) != undefined)
    }


    function searchDefaultFilters(material) {
        httpsAxios.get(typesUrl)
            .then(resp => {
                setCheckboxes(resp.data['types'].reduce(
                    (options, option) => ({
                        ...options,
                        [option.id]: material.some((value, idx, arr) => value.id === option.id),
                    }),
                    []
                ))
                setTypes(resp.data['types'])
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })


        httpsAxios.get(sci_areasUrl)
            .then(resp_sci_areas => {
                httpsAxios.get(subjectsUrl)
                    .then(resp_subjects => {
                        setSci_Areas(resp_sci_areas.data['sci_areas'])
                        setSubjects(resp_subjects.data['subjects'])
                        setFilters([])
                    }).catch(err => {
                        const error = ResponseHandler(err.response)
                        setTimeout(() => { setError(error) }, 3000)
                    })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })

    }

    function onSubmit() {

        const selectedAvailableTypes = selectedTypes.filter(t => materialTypes.find(type => type.id == t.id))

        if (selectedAvailableTypes.length === 0) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                time: 2000,
                size: 'mini',
                description: 'Select at least one material'
            })
        }
        localStorage.setItem('reservation', JSON.stringify(selectedAvailableTypes))
        props.history.push({
            pathname: '/auth/teacher/newreservation/types/checkout',
        })
    }

    function onChangeFilter(filter) {

        if (filter.id != 'all') {
            let changed = filters
            const idx = changed.findIndex(f => f.type === filter.type)
            if (idx > -1) {
                changed[idx] = filter
            }
            else {
                changed.push(filter)
            }
            setFilters(changed)
            applyFilters([filter])
        }
    }

    function filterTypesEvent(event) {
        event.preventDefault()

        if (filters.length > 0) {
            setTypes(searchedtypes)
            setReset('visible')
        }
    }

    function resetFilter(event) {
        event.preventDefault()
        setReset('hidden')
        props.history.push(props.location.pathname)

        searchDefaultFilters(selectedTypes)
    }

    function findFilter(type) {
        let filter = filters.find(f => f.type === type)
        if (filter != undefined) {
            return filter.id
        }
        return 'all'
    }

    function selectCheckBox(name) {
        setCheckboxes({
            ...checkboxes,
            [name]: !checkboxes[name]
        })
    }

    function onChangeCheckbox(name) {

        selectCheckBox(name)

        if (selectedTypes.find(t => t.id == name) != undefined)
            setSelectedTypes(selectedTypes.filter(t => t.id != name))
        else {
            const type = materialTypes.find(t => t.id == name)
            let newTypes = selectedTypes
            newTypes.push(type)
            setSelectedTypes(newTypes)
        }

    }


    function createCheckBoxes() {
        return materialTypes.map(t => {
            return (
                <Grid.Column key={t.id}>
                    <Card centered key={t.id}>
                        <Card.Header>{t.name}</Card.Header>
                        <Card.Description>{t.id}</Card.Description>
                        <Card.Content extra>
                            {
                                checkboxes[t.id] === true ? <Button fluid color='green' onClick={() => onChangeCheckbox(t.id)}> Selected! </Button>
                                    : <Button fluid onClick={() => onChangeCheckbox(t.id)}> Select </Button>
                            }
                        </Card.Content>
                    </Card>
                </Grid.Column>)
        })
    }

    const gridStyle = {
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
                        <Header size='medium'>Material:</Header>
                        <div style={style}>
                            <Filter changeFilter={onChangeFilter} name="sci_area" title="Scientific Area" types={sci_areas} value={findFilter("sci_area")} optionAll={findFilter("sci_area") == 'all'} />
                        </div>
                        <div style={style}>
                            <Filter changeFilter={onChangeFilter} name="subject" title="Subjects" types={subjects} value={findFilter("subject")} optionAll={findFilter("subject") == 'all'} />
                        </div>
                        <Button basic size='small' onClick={filterTypesEvent} icon='filter alternate' content='Filter' />
                        <Button basic size='small' id="reset_filter" style={{ ...style, visibility: reset }} onClick={resetFilter} content='Reset' />
                        <div>
                            <Button className="ui medium labeled icon button" onClick={onSubmit} icon='add' content='Add Material to Reservation' />
                        </div>
                        <Divider />

                        <Grid columns={4} style={gridStyle}>
                            {
                                createCheckBoxes()
                            }
                        </Grid>
                    </div>
            }
        </div>
    )
}
export default Material_Reservation