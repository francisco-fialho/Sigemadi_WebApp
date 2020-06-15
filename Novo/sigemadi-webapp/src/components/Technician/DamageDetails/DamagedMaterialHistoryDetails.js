import React, { useEffect, useState } from 'react'
import { Label, Button, Header, List, Card, Form, CardGroup, Divider, Message, Icon } from 'semantic-ui-react'
import { damageUrl } from '../../Utils/Links'
import axios from 'axios'
import { SemanticToastContainer } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import DamagedMaterialDetails from './DamagedMaterialDetails';
import Page404 from '../../Errors/Page404';


function History_Material_Details(props) {


    const [material_report, setMaterialReport] = useState({})
    const [error, setError] = useState(null)


    useEffect(() => {
        const id = props.match.params['id']
        axios.get(damageUrl.replace(':id', id))
            .then(resp => {
                if(resp.data.state=='to_solve') return setError(<Page404/>)
                setMaterialReport({ ...resp.data })
            }).catch(err => setError(Response_Handler(err.response)))
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