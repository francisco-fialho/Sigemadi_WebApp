import React, { useState, useEffect, useRef } from 'react'
import QrReader from 'react-qr-reader'
import Cookies from 'universal-cookie';
import { Modal, Header, Button, ButtonGroup, Grid, Divider, Card, Message, Icon } from 'semantic-ui-react';
import axios from 'axios'
import { materialsUrl, materialUrl } from '../Utils/Links'
import FilterMaterial from '../FilterMaterial';
import ResponseHandler from '../ResponseHandler'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';



function Material_Request(props) {

    const scrollObserve = useRef()

    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScrollRadio] = useState(null)
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
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })

    useEffect(() => {

        if (props.match.params.id != undefined) {
            setId(props.match.params.id)
        }

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
        setScrollRadio(radio)
    }, scrollOptions)

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
            const material = id == null ? JSON.parse(localStorage.getItem('new_material')) : JSON.parse(localStorage.getItem(`${id}_material`))
            if (material != null) {
                setCheckboxes(material.reduce(
                    (options, option) => ({
                        ...options,
                        [option.id]: true,
                    }),
                    []
                ))
                // material.map(m => selectCheckBox(m.id))
                setSelectedMaterials(material)
            }
        }
    }, [materials, id])


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

        httpsAxios.get(materialsUrl + url)
            .then(async resp => {
                const data = resp.data['materials']

                if (resp.length == 0 && materialAdded.length == 0) {
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
                await setMaterials(newMaterial)
                setShowLoading(false)
                setSearchFilters(filters)
            })
            .catch(err => {
                const error = ResponseHandler(err.response)
                                            setTimeout(() => {setError(error)}, 3000)
            })
    }

    async function addMaterial() {

        let selectedAvailableMaterial = selectedMaterials.filter(m => materials.find(material => material.id == m.id) != undefined)

        //CASO SEJA SELECIONADO UM MATERIAL NUMA PÁGINA MAIS A FRENTE QUE NAO TENHA SIDO CARREGADA TENHO DE VER
        // SE ESTA DISPONIVEL PARA O ADICIONAR, PARA FAZER O MINIMO DE PEDIDOS POSSIVEL

        let checkMaterial = selectedMaterials.filter(m => materials.find(material => material.id == m.id) == undefined)

        if (checkMaterial.length > 0) {
            let material = '?material='
            checkMaterial.map((m, idx) => {
                material += m.id
                if (idx + 1 != checkMaterial.length)
                    material += ','
            })


            const resp = await httpsAxios.get(materialsUrl + material)

            resp.data['materials'].map(m => {
                if (m.can_be_reported) {
                    selectedAvailableMaterial.push(m)
                }
            })
        }


        if (selectedAvailableMaterial.length === 0) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                size: 'mini',
                time: 2000,
                description: 'Select at least one material'
            })
        }

        const saveObject = id == null ? 'new_material' : `${id}_material`

        localStorage.setItem(saveObject, JSON.stringify(selectedAvailableMaterial))

        if (id === null) {
            props.history.push('/auth/staff/newrequest/material/checkout')
        }
        else {
            props.history.push(`/auth/staff/request/${id}/material/checkout`)
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

    function onSubmitQrCode() {
        if (result != null) {
            handleClose()
            const id = result
            httpsAxios.get(materialUrl.replace(':id', id))
                .then(resp => {
                    if (resp.data.state === 'available') {
                        selectCheckBox(result)
                        selectMaterial(result)
                    }
                    else return toast({
                        type: 'error',
                        title: 'Can´t select the material specified',
                        description: 'The Qr Code scanned doesn´t belong to a material, or the material is not available',
                        time: 3000,
                        size: 'mini'
                    })
                }).catch(err => {
                    const error = ResponseHandler(err.response)
                                            setTimeout(() => {setError(error)}, 3000)
                })
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
                selectedMaterials.push(material)
                setSelectedMaterials(selectedMaterials)
            }
        }
    }


    function createCheckBoxes() {
        return materials.map(m => {
            return (
                <Grid.Column key={m.id}>
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

                        <FilterMaterial {...props} setFilters={setFilters} />
                        <Divider />

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
                                    <Button basic color='green' onClick={onSubmitQrCode} content='Confirm' inverted></Button>
                                    <Button basic color='red' onClick={handleClose} content='Cancel' inverted></Button>
                                </ButtonGroup>
                            </Modal.Actions>
                        </Modal>
                        <div>
                            <Grid columns={3} id='material' style={style} >
                                {
                                    materials.length==0 && !showLoading ? <Message>There are no results</Message> : createCheckBoxes()
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
export default Material_Request