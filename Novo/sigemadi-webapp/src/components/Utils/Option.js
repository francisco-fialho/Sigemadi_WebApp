import React from 'react'

const Option = (props) => {


    const changeOption = (event) => {
        props.changeOption(event.target.value)
    }

    return (
        <select value={props.value} onChange={changeOption} >
            {
                props.defaultValue ? <option value='all' key='all'>{props.defaultValue}</option> : null
            }
            {

                props.values.map(t => {
                    return (
                        <option value={t} key={t}>{t}</option>
                    )
                })
            }
        </select>
    )
}
export default Option