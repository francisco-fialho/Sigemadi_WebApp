import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'semantic-ui-react'
import Filter from './Utils/Filter'
import axios from 'axios'
import { sci_areasUrl, typesUrl, typeUrl, subjectsUrl, sci_areaUrl, subjectUrl } from './Links'
import Response_Handler from './ResponseHandler'

const filterOrder = ["sci_area", "subject", "type"]

function Filter_Material(props) {



    const [materialTypes, setTypes] = useState([])
    const [subjects, setSubjects] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [filters, setFilters] = useState([])
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(null) 

        useEffect(() => {

            if (props.location && props.location.search) {
                const querystring = new URLSearchParams(props.location.search)
                const entries = querystring.entries()
                let next = entries.next()
                let filtersUrl = []
                do {
                    filtersUrl.push({ type: next.value[0], id: next.value[1] })
                    next = entries.next()
                } while (!next.done)

                setFilters(filtersUrl)

                if (filtersUrl.length > 0) {
                    const resetButton = document.getElementById("reset_filter")
                    resetButton.style.visibility = "visible"
                }
                searchDefaultFilters(true)
            }
            else {
                searchDefaultFilters()
                props.setFilters()
            }

        }, [])

    useEffect(() => {
        if (ready === true)
            applyFilters(filters)
    }, [ready])




    function searchDefaultFilters(hasQuery) {
        axios.get(sci_areasUrl)
            .then(resp_areas => {
                axios.get(subjectsUrl)
                    .then(resp_subjects => {
                        axios.get(typesUrl)
                            .then(resp_types => {
                                setSci_Areas(resp_areas.data['sci_areas'])
                                setSubjects(resp_subjects.data['subjects'])
                                setTypes(resp_types.data['types'])

                                if (hasQuery)
                                    setReady(true)
                            }).catch(err => setError(Response_Handler(err.response)))
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }


    function applyFilters(filtersUrl) {
        const lastFilter = filtersUrl[filtersUrl.length - 1]
        const filter_area = filters.find(f => f.type == 'sci_area')
        const filter_type = filters.find(f => f.type == 'type')
        const filter_subject = filters.find(f => f.type == 'subject')


        if (lastFilter.type === 'sci_area') {
            searchSci_Area(lastFilter, filter_subject, filter_type, filtersUrl)

        }
        else if (lastFilter.type === 'subject') {
            searchSubjects(lastFilter, filter_area, filter_type, filtersUrl)
        }

        else if (lastFilter.type === 'type') {
            searchTypes(lastFilter, filter_area, filter_subject, filtersUrl)
        }
    }

    function searchSci_Area(lastFilter, filter_subject, filter_type, filtersUrl) {
        axios.get(sci_areaUrl.replace(':id', lastFilter.id))
            .then(resp => {
                let subj = intersect(resp.data['subjects'], subjects)
                let types = intersect(resp.data['types'], materialTypes)


                if (filter_type != undefined) {
                    types = intersect(types, [filter_type])
                    if (types.length == 0) types = [filter_type]
                }

                if (filter_subject != undefined) {
                    subj = intersect(subj, [filter_subject])
                    if (subj.length == 0) subj = [filter_subject]
                }

                if (ready == true) {
                    props.setFilters(searchUrl([...filtersUrl]))
                    setReady(false)
                }


                setSubjects(subj)
                setTypes(types)

            }).catch(err => setError(Response_Handler(err.response)))
    }

    function searchSubjects(lastFilter, filter_area, filter_type, filtersUrl) {
        axios.get(subjectUrl.replace(':id', lastFilter.id))
            .then(resp_subject => {

                let sci_id = resp_subject.data['sci_area'].id
                if (filter_area != undefined) {
                    sci_id = filter_area.id
                }
                axios.get(sci_areaUrl.replace(':id', sci_id))
                    .then(resp_area => {
                        let areas = intersect([resp_subject.data['sci_area']], sci_areas)
                        let types = intersect(resp_subject.data['types'], resp_area.data['types'])

                        if (ready == true) {
                            props.setFilters(searchUrl([...filtersUrl]))
                            setReady(false)
                        }

                        if (filter_area != undefined) {
                            areas = intersect(areas, [filter_area])
                            if (areas.length == 0) areas = [filter_area]
                        }

                        if (filter_type != undefined) {
                            types = intersect(types, [filter_type])
                            if (types.length == 0) types = [filter_type]
                        }

                        setSci_Areas(areas)
                        setTypes(types)

                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }

    function searchTypes(lastFilter, filter_area, filter_subject, filtersUrl) {
        axios.get(typeUrl.replace(':id', lastFilter.id))
            .then(resp_type => {
                let areas = intersect([resp_type.data['sci_area']], sci_areas)
                let subj = intersect(resp_type.data['subjects'], subjects)
                let types = materialTypes

                let sci_id = resp_type.data['sci_area'].id
                if (filter_area != undefined) {
                    sci_id = filter_area.id
                }

                axios.get(sci_areaUrl.replace(':id', sci_id))
                    .then(resp_area => {

                        types = intersect(resp_area.data['types'], types)
                        if (types.length == 0) types = [lastFilter]

                        if (filter_subject != undefined) {
                            axios.get(subjectUrl.replace(':id', filter_subject.id))
                                .then(resp_subject => {
                                    types = intersect(resp_subject.data['types'], types)
                                    if (types.length == 0) types = [lastFilter]
                                    setTypes(types)
                                })
                        } else {
                            setTypes(types)
                        }

                        if (ready == true) {
                            props.setFilters(searchUrl([...filtersUrl]))
                            setReady(false)
                        }
                        if (filter_area != undefined) {
                            areas = intersect(areas, [filter_area])
                            if (areas.length == 0) areas = [filter_area]
                        }
                        if (filter_subject != undefined) {
                            subj = intersect(subj, [filter_subject])
                            if (subj.length == 0) subj = [filter_subject]
                        }

                        setSci_Areas(areas)
                        setSubjects(subj)
                    }).catch(err => setError(Response_Handler(err.response)))


            }).catch(err => setError(Response_Handler(err.response)))
    }


    function changeFilters(filter) {
        let changed = filters
        const idx = changed.findIndex(f => f.type === filter.type)
        if (idx > -1) {
            changed[idx] = filter
        }
        else {
            changed.push(filter)
        }
        setFilters(changed)
    }




    function searchUrl(filtersUrl) {
        let search = '?'
        filtersUrl = filtersUrl.sort((a, b) => {
            return filterOrder.indexOf(a.type) - filterOrder.indexOf(b.type)
        })
        filtersUrl.map((filter, idx) => {
            search += `${filter.type}=${filter.id}`
            if (idx + 1 != filters.length) {
                search += '&'
            }
        })
        return search
    }

    function intersect(array1, array2) {
        return array1.filter(a => array2.find(b => b.id == a.id) != undefined)
    }

    function onChangeFilter(filter) {
        if (filters.length === 0) {
            const resetButton = document.getElementById("reset_filter")
            resetButton.style.visibility = "visible"
        }
        if (filter.id != 'all') {
            changeFilters(filter)
            applyFilters([filter])
        }
    }

    function filterMaterialEvent(event) {
        event.preventDefault()
        const resetButton = document.getElementById("reset_filter")

        if (filters.length > 0) {

            const search = searchUrl(filters)
            resetButton.style.visibility = "visible"

            if (props.updateUrl) {
                props.history.push({
                    pathname: props.location.pathname,
                    search: search
                })
            }

            props.setFilters(search)
        }
    }


    function resetFilter(event) {
        event.preventDefault()
        const resetButton = document.getElementById("reset_filter")
        resetButton.style.visibility = "hidden"
        props.history.push(props.location.pathname)
        searchDefaultFilters()
        setFilters([])
        props.setFilters()
    }

    function findFilter(type) {
        let filter = filters.find(f => f.type === type)
        if (filter != undefined) {
            return filter.id
        }
        return 'all'
    }

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }


    return (
        <div>
            {
                error?error:
                <div>
                
                <div style={style}>
                    <Filter changeFilter={onChangeFilter} name="sci_area" title="Scientific Areas" types={sci_areas} value={findFilter('sci_area')} />
                </div>
                <div style={style}>
                    <Filter changeFilter={onChangeFilter} name="subject" title="Subjects" types={subjects} value={findFilter('subject')} />
                </div>
                <div style={style}>
                    <Filter changeFilter={onChangeFilter} name="type" title="Material Types" types={materialTypes} value={findFilter('type')} />
                </div>
                <Button basic size='small' content='Filter' icon='filter' onClick={filterMaterialEvent}></Button>
                <Button basic size='small' content='Reset' icon='filter' id='reset_filter' onClick={resetFilter} style={{ ...style, visibility: "collapse" }}></Button>
                </div>
            }
        </div>
    )
}



export default Filter_Material