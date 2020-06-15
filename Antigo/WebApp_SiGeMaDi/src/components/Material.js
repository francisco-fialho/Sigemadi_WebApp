import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Header, Message, Button, Divider, Grid, Card, Icon } from 'semantic-ui-react'
import Filter_Material from './FilterMaterial'
import { materialsUrl } from './Links'
import { SemanticToastContainer, toast } from "react-semantic-toasts";
import Response_Handler from './ResponseHandler'

//PROVAVELMENTE VOU TER QUE REPARTIR ESTA CLASSE POR CHECKBOXES E SO VER MATERIAIS NO NORMAL
function Material(props) {

    const scrollObserve = useRef()

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)



    const [materials, setMaterials] = useState([])
    const [searchFilters, setSearchFilters] = useState(null)

    useEffect(() => {
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
        if (scrollRadio >= 0 && moreData && searchFilters != null && !showLoading) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            searchMaterial(searchFilters, newPage, materials)
        }
    }, [scrollRadio])

    function canReport(){
        const user = JSON.parse(sessionStorage.getItem('userinfo'))
        return user.selectedRole === 'employee'
    }

    function searchMaterial(search, pageNumber, materialAdded) {
        let url = search
        if (!url) url = '?'
        else url += '&'
        url += `page=${pageNumber}`


        axios.get(materialsUrl + url)
            .then(resp => {
                const data = resp.data['materials']

                if (data.length === 0 && materialAdded.length === 0) {
                    return toast({
                        type: 'error',
                        title: 'Something went wrong',
                        time: 2000,
                        size: 'mini',
                        description: 'There are no results for the specified parameters'
                    })
                }

                if (data.length === 0) setMoreData(false)

                const newMaterial = materialAdded
                newMaterial.push(...data)
                setMaterials(newMaterial)
                setShowLoading(false)

                setSearchFilters(search)
            })
            .catch(err => Response_Handler(err.response))
    }

    function setFilters(filter) {
        if (!filter) filter = ''
        const newPage = 1
        setPage(newPage)
        setMaterials([])
        setMoreData(true)
        searchMaterial(filter, newPage, [])
    }


    function createMaterialList() {
        return materials.map(m => {
            return (
                <Grid.Column key={m.name}>
                    <Card  centered>
                        <Card.Header>{m.name}</Card.Header>
                        <Card.Description>{m.id}</Card.Description>
                        <Card.Content extra>
                            <Button.Group fluid>
                                <Button content='Details' icon='microchip' onClick={() => props.history.push(props.location.pathname + '/' + m.id)}></Button>
                                {
                                    m.can_be_reported && canReport() ? <Button content='Report' icon='bug' color='red' onClick={() => props.history.push(props.location.pathname.replace('material', 'report') + '/' + m.id)}></Button> : null
                                }
                            </Button.Group>
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
            <Header>Material:</Header>

            <Filter_Material {...props} setFilters={setFilters} updateUrl />
            <Divider />
            <div>
                <Grid columns={3} style={style}>
                    {
                        createMaterialList()
                    }
                </Grid>
                <div ref={scrollObserve}></div>
                {
                    showLoading ? <Message size='small'><Icon name='circle notch' loading />Loading...</Message> : null
                }
            </div>
        </div>
    )
}

export default Material