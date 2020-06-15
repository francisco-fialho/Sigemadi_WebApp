import React, { useEffect, useState } from "react"
import Filter from '../Utils/Filter'
import CheckBox from '../CheckBox/CheckBox'
import { Header, Button, Form, Divider, Card, Grid } from "semantic-ui-react"
import { typesUrl, sci_areasUrl, subjectsUrl, sci_areaUrl, subjectUrl } from '../Links'
import axios from 'axios'
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer } from 'react-semantic-toasts'

const filterOrder = ["sci_area", "subject"]


function MaterialTypes(props) {

    const [materialTypes, setTypes] = useState([])
    const [checkboxes, setCheckboxes] = useState([])
    const [filters, setFilters] = useState([])
    const [subjects, setSubjects] = useState([])
    const [sci_areas, setSci_Areas] = useState([])
    const [searchedtypes, setSearchedTypes] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])

    const style = {
        display: 'inline-block',
        margin: 10,
        marginBottom: 30
    }



    useEffect(() => {
        // if (props.location && props.location.search) {
        //     const querystring = new URLSearchParams(props.location.search)
        //     const entries = querystring.entries()
        //     let next = entries.next()
        //     let filtersInUrl = []
        //     do {
        //         filtersInUrl.push({ type: next.value[0], name: next.value[1] })
        //         next = entries.next()
        //     } while (!next.done)

        //     const filtered = filterMaterial(filtersInUrl)

        //     if (filtersInUrl.length > 0) {
        //         const resetButton = document.getElementById("reset_filter")
        //         resetButton.style.visibility = "visible"
        //     }

        //     searchFilters(filters)
        //     setFilters(filtersInUrl)
        //     filterTypes()
        // }
        // else {

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
            searchSci_Area(lastFilter, filter_subject, filtersUrl)

        }
        else if (lastFilter.type === 'subject') {
            searchSubjects(lastFilter, filter_area, filtersUrl)
        }
    }

    function searchSci_Area(lastFilter, filter_subject) {
        axios.get(sci_areaUrl.replace(':id', lastFilter.id))
            .then(resp => {
                let subj = intersect(resp.data['subjects'], subjects)
                let types = intersect(resp.data['types'], materialTypes)

                if (filter_subject != undefined) {
                    subj = intersect(subj, [filter_subject])
                    if (subj.length == 0) subj = [filter_subject]
                }

                setSubjects(subj)
                setSearchedTypes(types)

            }).catch(err => Response_Handler(err.response))
    }

    function searchSubjects(lastFilter, filter_area) {
        axios.get(subjectUrl.replace(':id', lastFilter.id))
            .then(resp_subject => {

                let sci_id = resp_subject.data['sci_area'].id
                if (filter_area != undefined) {
                    sci_id = filter_area.id
                }
                axios.get(sci_areaUrl.replace(':id', sci_id))
                    .then(resp_area => {
                        let areas = [resp_subject.data['sci_area']]
                        let types = intersect(resp_subject.data['types'], resp_area.data['types'])

                        if (filter_area != undefined) {
                            areas = intersect(areas, [filter_area])
                            if (areas.length == 0) areas = [filter_area]
                        }

                        setSci_Areas(areas)
                        setSearchedTypes(types)

                    }).catch(err => Response_Handler(err.response))
            }).catch(err => Response_Handler(err.response))
    }


    function intersect(array1, array2) {
        return array1.filter(a => array2.find(b => b.id === a.id) != undefined)
    }


    function searchDefaultFilters(material) {
        axios.get(typesUrl)
            .then(resp => {
                setCheckboxes(resp.data['types'].reduce(
                    (options, option) => ({
                        ...options,
                        [option.id]: material.some((value, idx, arr) => value.id === option.id),
                    }),
                    []
                ))
                setTypes(resp.data['types'])
            }).catch(err => Response_Handler(err.response))


        axios.get(sci_areasUrl)
            .then(resp_sci_areas => {
                axios.get(subjectsUrl)
                    .then(resp_subjects => {
                        setSci_Areas(resp_sci_areas.data['sci_areas'])
                        setSubjects(resp_subjects.data['subjects'])
                        setFilters([])
                    }).catch(err => Response_Handler(err.response))
            }).catch(err => Response_Handler(err.response))

    }

    function filterTypes() {
        setTypes(searchedtypes)
    }

    function changeFilter(filter) {
        if (filters.length === 0) {
            const resetButton = document.getElementById("reset_filter")
            resetButton.style.visibility = "visible"
        }
        if (filter.id != 'all') {
            // let changeFilters = filters
            // const idx = changeFilters.findIndex(f => f.type === filter.type)

            // if (idx > -1) {
            //     changeFilters.splice(idx, 1, filter)
            // }
            // else {
            //     changeFilters.push({ ...filter })
            // }

            // if (filter.type === 'sci_area')
            //     searchSciArea(filter.id)
            // else if (filter.type === 'subject')
            //     searchSubject(filter.id)

            // setFilters(changeFilters)

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
        const resetButton = document.getElementById("reset_filter")

        if (filters.length > 0) {

            filterTypes()
            resetButton.style.visibility = "visible"
        }
    }

    function resetFilter(event) {
        event.preventDefault()
        const resetButton = document.getElementById("reset_filter")
        resetButton.style.visibility = "hidden"
        props.history.push(props.location.pathname)
        // let checked = Object.keys(checkboxes)
        //     .filter((checkBox) => checkboxes[checkBox])

        searchDefaultFilters(selectedTypes)
    }

    function findFilter(type) {
        let filter = filters.find(f => f.type === type)
        if (filter != undefined) {
            return filter.id
        }
        return 'all'
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
                                checkboxes[t.id] === true ? <Button fluid color='green' onClick={() => onChange(t.id)}> Selected! </Button>
                                    : <Button fluid onClick={() => onChange(t.id)}> Select </Button>
                            }
                        </Card.Content>
                    </Card>
                </Grid.Column>)
        })
    }
    function onSubmit() {
        props.addMaterial(selectedTypes)
    }

    function selectCheckBox(name) {
        setCheckboxes({
            ...checkboxes,
            [name]: !checkboxes[name]
        })
    }

    function onChange(name) {
        //const { name } = event.target
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

    const gridStyle = {
        height: 30,
        margin: 6,
        padding: 8
    }


    return (
        <div>
            <SemanticToastContainer />
            <Header size='medium'>Material:</Header>
            <div style={style}>
                <Filter changeFilter={changeFilter} name="sci_area" title="Scientific Area" types={sci_areas} value={findFilter("sci_area")} />
            </div>
            <div style={style}>
                <Filter changeFilter={changeFilter} name="subject" title="Subjects" types={subjects} value={findFilter("subject")} />
            </div>
            <Button basic size='small' onClick={filterTypesEvent} icon='filter alternate' content='Filter' />
            <Button basic size='small' id="reset_filter" style={{ ...style, visibility: "collapse" }} onClick={resetFilter} content='Reset' />
            <div>
                <Button className="ui medium labeled icon button" onClick={onSubmit} icon='add' content='Add Material' />
            </div>
            <Divider />

            <Grid columns={4} style={gridStyle}>
                {
                    createCheckBoxes()
                }
            </Grid>

        </div>
    )
}
export default MaterialTypes