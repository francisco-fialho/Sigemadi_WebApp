import React from 'react'

const Filter = (props) => {

    const changeFilter = (event) => {
        const filter = {
            type: props.name,
            id: event.target.value
        }
        props.changeFilter(filter)
    }

    const buildDropDown = () => {
        return (
            <div>
                {
                    props.title ? <label style={{ margin: 10 }}>Filter by {props.title}:</label> : null
                }
                <select value={props.value} onChange={changeFilter}>
                    <option value='all' key='all'>All</option>
                    {

                        props.types.map(t => {
                            return (
                                <option value={t.id} key={t.id}>{t.name}</option>
                            )
                        })
                    }
                </select>
            </div>
        )
    }

    return (
        <div>
            {
                buildDropDown()
            }
        </div>
    )
}


export default Filter