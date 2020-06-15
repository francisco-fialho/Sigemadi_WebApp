import React, { useEffect, useState } from 'react'
import Damaged_Material_Details from './DamagedMaterialDetails'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import { damageUrl, damagesStatesUrl } from '../../Links' 
import {Message,Icon} from 'semantic-ui-react'
import axios from 'axios'
import Page_404 from '../../Errors/Page404';

function Damage_Material_Active_Details(props) {

    const [material_report, setMaterial_Report] = useState({
        states: []
    })
    const [error, setError] = useState(null)


    useEffect(() => {
        const id = props.match.params['id']
        axios.get(damageUrl.replace(':id', id))
            .then(resp => {
                if(resp.data.state!='to_solve') return setError(<Page_404 />)
                axios.get(damagesStatesUrl)
                    .then(r => {
                        setMaterial_Report({
                            ...resp.data,
                            states: r.data['states']
                        })
                    }).catch(err => setError(Response_Handler(err.response)))
            }).catch(err => setError(Response_Handler(err.response)))
    }, [])

    function onCancel() {
        props.history.goBack()
    }

    function onSave() {
        const button = document.getElementById('confirm')
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
        button.disabled = true
        axios.patch(damageUrl.replace(':id', material_report.id), { "state": material_report.state, "report": material_report.report })
            .then(resp => {
                Response_Handler(resp)
                setTimeout(() => props.history.push('/auth/tech/damages'), 2000)
            }).catch(err => {
                Response_Handler(err.response)
                button.disabled = false
            })
    }

    function changeState(value) {
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
                        <Damaged_Material_Details
                            changeState={changeState}
                            material_report={material_report}
                            changeMaterialReport={(value) => setMaterial_Report(value)}
                            onSave={onSave}
                            onCancel={onCancel}
                        />
            }
        </div>
    )



}
export default Damage_Material_Active_Details