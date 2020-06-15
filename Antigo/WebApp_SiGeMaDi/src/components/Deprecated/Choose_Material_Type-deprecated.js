import React from 'react'
import { Divider } from 'semantic-ui-react'

const ChooseMaterialType = (props) => {
    return (
        <div>
            <h3 className="ui large header">Escolha uma opção:</h3>
            <Divider />
            <div style={{ marginTop: '5%' }}>
                <button className="ui huge labeled icon button" onClick={() => props.history.push('/auth/labmanager/addtype')}><i className="box icon"></i>Adicionar Tipo de Material</button >
            </div>
            <div style={{ marginTop: '5%' }}>
                <button className="ui huge labeled icon button" onClick={() => props.history.push('/auth/labmanager/addmaterial')}><i className="boxes icon"></i>Adicionar Material</button >
            </div>
        </div>
    )
}

export default ChooseMaterialType