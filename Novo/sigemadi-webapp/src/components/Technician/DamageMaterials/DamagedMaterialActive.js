import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { damagesUrl } from '../../Utils/Links'
import { SemanticToastContainer } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import DamagedMaterial from './DamagedMaterial'
import { Message, Icon } from 'semantic-ui-react'


function Damaged_Material_Active(props) {

    const scrollObserve = useRef()
    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)
    const [error, setError] = useState(null)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })



    const [material, setMaterial] = useState([])

    useEffect(() => {
        intersectionObserver.observe(scrollObserve.current)
        return () => {
            intersectionObserver.disconnect()
        }
    }, [])


    useEffect(() => {
        if (scrollRadio >= 0 && moreData && !showLoading) {
            const newPage = page + 1
            setPage(newPage)
            setShowLoading(true)
            getDamages(newPage, material)
        }
    }, [scrollRadio])

    const scrollOptions = {
        root: document.querySelector('#damages'),
        rootMargin: '5px',
        threshold: 1.0
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    },scrollOptions)

    function getDamages(pageNumber, damageReports) {
        httpsAxios.get(damagesUrl.replace(':flag', 'false') + `&page=${pageNumber}`)
            .then(resp => {
                const data = resp.data['damages']
                if (data.length === 0) setMoreData(false)

                let damages = damageReports
                damages.push(...data)
                setMaterial(damages)

                setShowLoading(false)
            }).catch(err => setError(Response_Handler(err.response)))
    }



    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    <div>
                        <DamagedMaterial title='Damage Reports:' material={material} moreData={moreData} {...props} />
                        <div id='damages'>
                            <div ref={scrollObserve}></div>
                            {
                                showLoading ? <Message size='small'><Icon name='circle notch' loading />Loading...</Message> : null
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default Damaged_Material_Active