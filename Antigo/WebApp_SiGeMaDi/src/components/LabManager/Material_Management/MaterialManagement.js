import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Input, Divider, Message, Grid, Card, Modal, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { materialUrl, materialsUrl } from '../../Links'
import Response_Handler from '../../ResponseHandler'
import Filter_Material from '../../FilterMaterial'
import { SemanticToastContainer } from 'react-semantic-toasts';

const MIN = '1'
function Material_Management(props) {

    const scrollObserve = useRef()

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [searchFilters, setSearchFilters] = useState(null)
    const [modal, setModal] = useState(false)
    const [bulkMaterial, setBulkMaterial] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [error, setError] = useState(null)


    const [materials, setMaterials] = useState([])

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

    function setFilters(filter) {
        if (!filter) filter = ''
        const newPage = 1
        setPage(newPage)
        setMaterials([])
        setMoreData(true)
        searchMaterial(filter, newPage, [])
    }

    function searchMaterial(filters, pageNumber, materialAdded) {
        let url = filters
        if (!url) url += '?'
        else url += '&'
        url += `state=available&page=${pageNumber}`

        axios.get(materialsUrl + url)
            .then(async resp => {
                const data = resp.data['materials']
                if (resp.length === 0 && materialAdded.length === 0) {
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
                await setMaterials(newMaterial)
                setShowLoading(false)

                setSearchFilters(filters)
            })
            .catch(err => setError(Response_Handler(err.response)))
    }

    function onSubmit() {
        props.history.push('/auth/labmanager/addmaterial')
    }

    function deleteMaterial(id) {
        const deleteButton = document.getElementById('delete' + id)
        deleteButton.disabled = true
        const detailButton = document.getElementById('detail' + id)
        detailButton.disabled = true

        if (bulkMaterial != '') {

            //ADICIONAR A QUANTIDADE PARA ELIMINAR O BULK MATERIAL ESPERAR PELO TIAGO
            axios.delete(materialUrl.replace(':id', id))
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => setFilters(props.location.search), 2000)

                })
                .catch(err => {
                    Response_Handler(err.response)
                    deleteButton.disabled = false
                    detailButton.disabled = false
                })
            setBulkMaterial('')
        }
        else {

            axios.delete(materialUrl.replace(':id', id))
                .then(resp => {
                    Response_Handler(resp)
                    setTimeout(() => setFilters(props.location.search), 2000)

                })
                .catch(err => {
                    Response_Handler(err.response)
                    deleteButton.disabled = false
                    detailButton.disabled = false
                })

        }
    }

    function onChangeQuantity(value, max) {
        if (parseInt(value) > parseInt(max)) {
            value = max
        }
        if (parseInt(value) < parseInt(MIN)) {
            value = MIN
        }
        setQuantity(value)
    }

    async function deleteBulkMaterial(material) {
        await setBulkMaterial(material)
        setModal(true)
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
                        <Card.Content>
                            {material.id}
                        </Card.Content>
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

                        <Filter_Material {...props} setFilters={setFilters} updateUrl></Filter_Material>
                        <div>
                            <Button icon='add' content='Add Material' onClick={onSubmit} ></Button>
                        </div>
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
                    </div>
            }
        </div>
    )
}

export default Material_Management