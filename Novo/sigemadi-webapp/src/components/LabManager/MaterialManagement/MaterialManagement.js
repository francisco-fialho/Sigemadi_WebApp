import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Input, Divider, Message, Grid, Card, Modal, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { materialUrl, materialsUrl } from '../../Utils/Links'
import Response_Handler from '../../ResponseHandler'
import FilterMaterial from '../../FilterMaterial'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const MIN = '1'
function Material_Management(props) {

    const scrollObserve = useRef()

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [searchFilters, setSearchFilters] = useState(null)
    const [modal, setModal] = useState(false)
    const [bulkMaterial, setBulkMaterial] = useState({})
    const [error, setError] = useState(null)


    const [materials, setMaterials] = useState([])

    useEffect(() => {
        intersectionObserver.observe(scrollObserve.current)
        return () => {
            intersectionObserver.disconnect()
        }
    }, [])

    const scrollOptions = {
        root: document.querySelector('#material'),
        rootMargin: '5px',
        threshold: 1.0
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    }, scrollOptions)

    useEffect(() => {
        if (scrollRadio >= 0 && moreData && searchFilters != null && !showLoading) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            searchMaterial(searchFilters, newPage, materials)
        }
    }, [scrollRadio])

    function setFilters(filter) {
        if (!filter) filter = ''
        const newPage = 1
        setPage(newPage)
        setMaterials([])
        setMoreData(true)
        setShowLoading(true)
        searchMaterial(filter, newPage, [])
    }

    function searchMaterial(filters, pageNumber, materialAdded) {
        let url = filters
        if (!url) url += '?'
        else url += '&'
        url += `state=available&page=${pageNumber}`

        axios.get(materialsUrl + url)
            .then(resp => {
                const data = resp.data['materials']
                if (data.length == 0 && materialAdded.length == 0) {
                    setShowLoading(false)
                    setMoreData(false)
                    return toast({
                        type: 'warning',
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

                setSearchFilters(filters)
            })
            .catch(err => setError(Response_Handler(err.response)))
    }


    function deleteMaterial(id) {
        const deleteButton = document.getElementById('delete' + id)
        deleteButton.disabled = true
        const detailButton = document.getElementById('detail' + id)
        detailButton.disabled = true


        axios.delete(materialUrl.replace(':id', id), { data: { "quantity": bulkMaterial.id != undefined ? bulkMaterial.delete_quantity : 1 } })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => setFilters(props.location.search), 3000)

            })
            .catch(err => {
                Response_Handler(err.response)
                deleteButton.disabled = false
                detailButton.disabled = false
            })

        if (bulkMaterial.id)
            setBulkMaterial({})

        setModal(false)
    }

    function onChangeQuantity(value, max) {
        if (parseInt(value) > parseInt(max)) {
            value = max
        }
        if (parseInt(value) < parseInt(MIN)) {
            value = MIN
        }
        setBulkMaterial({ ...bulkMaterial, delete_quantity: value })
    }

    function deleteBulkMaterial(material) {
        setBulkMaterial({ ...material, delete_quantity: 1 })
        setModal(true)
    }

    function onSubmit() {
        props.history.push('/auth/labmanager/addmaterial')
    }

    function createMaterialList() {
        return materials.map(material => {

            let deleteButton = <Button id={'delete' + material.id} compact onClick={() => deleteMaterial(material.id)} icon='remove' content='Delete Material' color='red'></Button>

            if (material.id.slice(0, 2) === '00') {
                deleteButton = <Button id={'delete' + material.id} compact onClick={() => deleteBulkMaterial(material)} icon='remove' content='Delete Material' color='red'></Button>

            }
            return (
                <Grid.Column>
                    <Card centered>
                    <Card.Header>{material.name}</Card.Header>
                    <Card.Description>{material.id}</Card.Description>
                        <Card.Content extra floated='right'>
                            <Button.Group fluid>
                                <Button id={'detail' + material.id} content='Details' icon='microchip' onClick={() => props.history.push(props.location.pathname + '/' + material.id)}></Button>
                                {deleteButton}
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
            {
                error ? error :
                    <div>
                        <Header size='medium'>Material:</Header>

                        <FilterMaterial {...props} setFilters={setFilters} updateUrl></FilterMaterial>
                        <div>
                            <Button icon='add' content='Add Material' onClick={onSubmit} ></Button>
                        </div>
                        <Divider />
                        <Modal size='small' open={modal} dimmer='blurring' >
                            <Header size='huge' textAlign='center'>Remove Material</Header>
                            <Modal.Content>
                                <Modal.Description>
                                    <Header size='large' textAlign='center'>Verify the quantity to remove</Header>
                                    <Divider />
                                    <Header textAlign='center'>{bulkMaterial.name} | {bulkMaterial.id}</Header>
                                    <Input type="number" size='small' required defaultValue={1} onChange={(event, object) => onChangeQuantity(object.value, bulkMaterial.available_quantity)} min={MIN} max={bulkMaterial.available_quantity} style={{ width: '90%' }}></Input>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions >
                                <Button color='red' onClick={() => deleteMaterial(bulkMaterial.id)} content='Remove' />
                                <Button onClick={() => setModal(false)} content='Cancel' />
                            </Modal.Actions>
                        </Modal>

                        <div>
                            <Grid columns={3} id='material' style={style}>
                                {
                                    materials.length == 0 && !showLoading ? <Message>There are no results</Message> : createMaterialList()
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

export default Material_Management