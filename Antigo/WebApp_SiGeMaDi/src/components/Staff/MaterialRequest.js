import React, { useState, useEffect, useRef } from 'react'
import QrReader from 'react-qr-reader'
import Cookies from 'universal-cookie';
import { Modal, Header, Button, ButtonGroup, Grid, Divider, Card, Message, Icon } from 'semantic-ui-react';
import axios from 'axios'
import { materialsUrl } from '../Links'
import Filter_Material from '../FilterMaterial';
import Response_Handler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';


const cookies = new Cookies();


function Material_Request(props) {

    const scrollObserve = useRef()

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [searchFilters, setSearchFilters] = useState(null)

    const [materials, setMaterials] = useState([])
    const [selectedMaterials, setSelectedMaterials] = useState([])
    const [id, setId] = useState(null)
    const [qrcode, setQrcode] = useState(false)
    const [result, setResult] = useState('')
    const [checkboxes, setCheckboxes] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {

        if (props.match.params.id != undefined) {
            setId(props.match.params.id)
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
        if (scrollRadio >= 0 && moreData && searchFilters != null && !showLoading) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            searchMaterial(searchFilters, newPage, materials)
        }
    }, [scrollRadio])

    useEffect(() => {
        if (materials.length > 0 && checkboxes.length == 0) {
            const material = JSON.parse(localStorage.getItem('material'))
            if (material != null) {
                setCheckboxes(materials.reduce(
                    (options, option) => ({
                        ...options,
                        [option.id]: material.some((value, idx, arr) => value.id === option.id),
                    }),
                    []
                ))
                setSelectedMaterials(material)
            }
        }
    }, [materials])


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
                data.map(m => {
                    if (selectedMaterials.find(material => m.id == material.id))
                        selectCheckBox(m.id)
                })
                setSearchFilters(filters)
            })
            .catch(err => setError(Response_Handler(err.response)))
    }

    function addMaterial() {

        const selectedAvailableMaterial = selectedMaterials.filter(m=>materials.find(material=>material.id==m.id)!=undefined)
        
        if (selectedAvailableMaterial.length === 0) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                size: 'mini',
                time: 2000,
                description: 'Select at least one material'
            })
        }

        localStorage.setItem('material', JSON.stringify(selectedAvailableMaterial))

        if (id === null) {
            props.history.push('/auth/staff/newrequest/checkout')
        }
        else {
            props.history.push(`/auth/staff/request/${id}/checkout`)
        }
    }


    function handleScan(data) {
        if (data) {
            setResult(data)
        }
    }
    function handleError(err) {
        console.error(err)
    }

    function onSubmit() {
        if (result != null) {
            handleClose()
            selectCheckBox(result)
            selectMaterial(result)
            setResult(null)
        }
    }

    function selectCheckBox(id) {
        setCheckboxes({
            ...checkboxes,
            [id]: !checkboxes[id]
        })

    }

    function handleOpen() {
        setQrcode(true)
    }

    function handleClose() {
        onCancel()
    }


    function onCancel() {
        setQrcode(false)
        setResult(null)
    }

    function onChange(name) {
        selectCheckBox(name)
        selectMaterial(name)
    }


    function selectMaterial(id) {
        if (selectedMaterials.find(m => m.id == id) != undefined) {
            setSelectedMaterials(selectedMaterials.filter(m => m.id != id))
        }
        else {
            const material = materials.find(m => m.id == id)
            if (material != undefined) {
                let newMaterials = selectedMaterials
                newMaterials.push(material)
                setSelectedMaterials(newMaterials)
            }
        }
    }


    function setFilters(filter) {
        if (!filter) filter = ''
        const newPage = 1
        setPage(newPage)
        setMaterials([])
        setMoreData(true)
        searchMaterial(filter, newPage, [])
    }


    function createCheckBoxes() {
        return materials.map(m => {
            return (
                <Grid.Column onSubmit={onSubmit} key={m.id}>
                    <Card centered key={m.id}>
                        <Card.Header>{m.name}</Card.Header>
                        <Card.Description>{m.id}</Card.Description>
                        <Card.Content extra>
                            {
                                checkboxes[m.id] === true ? <Button fluid color='green' onClick={() => onChange(m.id)}> Selected! </Button>
                                    : <Button fluid onClick={() => onChange(m.id)}> Select </Button>
                            }
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
                        <Header>Material:</Header>

                        <Button size='medium' onClick={addMaterial} icon='add' content='Add Material to Request' />
                        <Button size='medium' onClick={handleOpen} icon='qrcode' content='Read QR Code' />

                        <Filter_Material {...props} setFilters={setFilters} />
                        <Divider />

                        <Grid columns={3} style={style} >
                            {
                                createCheckBoxes()
                            }
                        </Grid>
                        <div ref={scrollObserve}></div>
                        {
                            showLoading ? <Message size='small'><Icon name='circle notch' loading />Loading...</Message> : null
                        }
                        <Modal
                            open={qrcode}
                            basic
                            dimmer='blurring'
                            onClose={handleClose}
                            size='small'
                        >
                            <Modal.Content>
                                <QrReader
                                    delay={300}
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '60%' }}
                                />
                                <Modal.Header style={{ textAlign: 'center' }}>{result}</Modal.Header>
                            </Modal.Content>
                            <Modal.Actions>
                                <ButtonGroup fluid>
                                    <Button basic color='green' onClick={onSubmit} content='Confirm' inverted></Button>
                                    <Button basic color='red' onClick={handleClose} content='Cancel' inverted></Button>
                                </ButtonGroup>
                            </Modal.Actions>
                        </Modal>
                    </div>
            }
        </div>
    )
}
export default Material_Request