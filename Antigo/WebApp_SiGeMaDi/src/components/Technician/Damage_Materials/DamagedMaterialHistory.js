import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Message, Icon } from 'semantic-ui-react'
import { damagesUrl } from '../../Links'
import { SemanticToastContainer } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import Damaged_Material from './DamagedMaterial'


function Damaged_Material_History(props) {
    const scrollObserve = useRef()
    const [showLoading, setShowLoading] = useState(false)
    const [scrollRadio, setScollRadio] = useState(null)
    const [page, setPage] = useState(0)
    const [moreData, setMoreData] = useState(true)

    const [material, setMaterial] = useState([])
    const [error, setError] = useState(null)

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
            getHistoryDamages(newPage, material)
        }
    }, [scrollRadio])


    const intersectionObserver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio
        setScollRadio(radio)
    })

    function getHistoryDamages(pageNumber, damageHistoryReports) {
        axios.get(damagesUrl.replace(':flag', 'true') + `&page=${pageNumber}`)
            .then(resp => {
                const data = resp.data['damages']
                if (data.length === 0) setMoreData(false)

                let damages = damageHistoryReports
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
                        <Damaged_Material title='Damage Reports History:' material={material} moreData={moreData} {...props} />
                        <div ref={scrollObserve}></div>
                        {
                            showLoading ? <Message size='small'><Icon name='circle notch' loading />Loading...</Message> : null
                        }
                    </div>
            }
        </div>
    )
}


export default Damaged_Material_History