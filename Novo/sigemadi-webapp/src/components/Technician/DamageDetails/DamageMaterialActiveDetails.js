import React, { useEffect, useState } from 'react'
import DamagedMaterialDetails from './DamagedMaterialDetails'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import { damageUrl, damagesStatesUrl } from '../../Utils/Links' 
import {Message,Icon} from 'semantic-ui-react'
import axios from 'axios'
import Page404 from '../../Errors/Page404';

function Damage_Material_Active_Details(props) {

    const [material_report, setMaterial_Report] = useState({
        states: []
    })
    const [error, setError] = useState(null)
    const [disableButton,setDisableButton] = useState(false)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const id = props.match.params['id']
        httpsAxios.get(damageUrl.replace(':id', id))
            .then(resp => {
                if(resp.data.state!='to_solve') return setError(<Page404 />)
                httpsAxios.get(damagesStatesUrl)
                    .then(r => {
                        setMaterial_Report({
                            ...resp.data,
                            states: r.data['states']
                        })
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }, [])

    function onCancel() {
        props.history.push(props.location.pathname.replace(`/${material_report.id}`,''))
    }

    function onConfirm() {
        if (material_report.report === undefined) {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Insert a solution description',
                time: 2000,
                size: 'mini'
            })
        }
        if (material_report.state === 'to_solve') {
            return toast({
                type: 'warning',
                title: 'Missing Information',
                description: 'Change the report state',
                time: 2000,
                size: 'mini'
            })
        }
        setDisableButton(true)
        httpsAxios.patch(damageUrl.replace(':id', material_report.id), { "state": material_report.state, "report": material_report.report })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => props.history.push('/auth/tech/damages'), 3000)
            }).catch(err => {
                Response_Handler(err.response)
                setDisableButton(false)
            })
    }

    function onChangeState(value) {
        if (value === 'all') return
        setMaterial_Report({
            ...material_report,
            state: value
        })
    }

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    !material_report.id ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <DamagedMaterialDetails
                            changeState={onChangeState}
                            material_report={material_report}
                            changeMaterialReport={(value) => setMaterial_Report(value)}
                            onConfirm={onConfirm}
                            buttonState={disableButton}
                            onCancel={onCancel}
                        />
            }
        </div>
    )



}
export default Damage_Material_Active_Details