import React, { useEffect, useState } from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { damageUrl } from '../../Utils/Links'
import axios from 'axios'
import { SemanticToastContainer } from 'react-semantic-toasts';
import ResponseHandler from '../../ResponseHandler'
import DamagedMaterialDetails from './DamagedMaterialDetails';
import Page404 from '../../Errors/Page404';


function History_Material_Details(props) {


    const [material_report, setMaterialReport] = useState({})
    const [error, setError] = useState(null)
    const httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


    useEffect(() => {
        const id = props.match.params['id']
        httpsAxios.get(damageUrl.replace(':id', id))
            .then(resp => {
                if (resp.data.state == 'to_solve') return setError(<Page404 />)
                setMaterialReport({ ...resp.data })
            }).catch(err => {
                const error = ResponseHandler(err.response)
                setTimeout(() => { setError(error) }, 3000)
            })
    }, [])

    return (
        <div>
            <SemanticToastContainer />
            {
                error ? error :
                    !material_report.id ? <Message>Loading...<Icon name='circle notched' loading /></Message> :
                        <DamagedMaterialDetails history material_report={material_report} />
            }
        </div>
    )
}

export default History_Material_Details