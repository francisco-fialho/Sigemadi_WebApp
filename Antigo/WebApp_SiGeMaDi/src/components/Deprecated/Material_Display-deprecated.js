import React, { Component } from 'react'
import { List } from 'semantic-ui-react'
import CheckBox from '../CheckBox/CheckBox'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { materialsUrl } from '../Links'
import {Button} from 'semantic-ui-react'
import Response_Handler from '../Response_Handler'

class Material_Display extends Component {

    constructor (props) {
        super(props)
        const material = []
        this.createMaterialList = this.createMaterialList.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onReport = this.onReport.bind(this)
        this.onChange = this.onChange.bind(this)
        this.selectCheckBox = this.selectCheckBox.bind(this)
        this.searchMaterials=this.searchMaterials.bind(this)
        this.state = {
            material: material,
            checkboxes: material.reduce(
                (options, option) => ({
                    ...options,
                    [option.id]: false,
                }),
                []
            ),
        }
    }

    componentWillMount() {
        this.searchMaterials()
    }

    searchMaterials(){
        axios.get(materialsUrl + (this.props.query || ''))
            .then(resp => {
                this.setState({ material: resp.data['materials'] })
            })
            .catch(err => Response_Handler(err.response.status))
    }

    onDelete(id) {
        this.props.onDelete(id).then(resp => this.searchMaterials())

    }

    onReport(id) {
        this.props.onReport(id)
    }

    onChange(event) {
        const { name } = event.target
        this.selectCheckBox(name)
    }

    selectCheckBox(name) {
        this.setState((prevState) => ({
            checkboxes: {
                ...prevState.checkboxes,
                [name]: !prevState.checkboxes[name]
            }
        }))
    }

    createMaterialList() {
        if (this.props.onDelete) {
            return this.state.material.map(material => {
                return <List.Item key={material.id}>
                    <List.Content floated='right'>
                        <Button size='big' compact onClick={() => this.onDelete(material.id)} icon='red close'></Button>
                    </List.Content>
                    <List.Content>
                        <Link to={this.props.location.pathname + '/' + material.id}>
                            {material.id}
                        </Link>
                    </List.Content>
                </List.Item>

            })
        }

        if (this.props.onReport) {
            return material.map(m => {
                return (
                    <List.Item key={m.name}>
                        <List.Content floated='right'>
                            <Button size='medium' color='red' onClick={() => this.onReport(m.id)} icon='bug' content='Reportar Avaria'></Button>
                        </List.Content>
                        <List.Content>
                            <Link to={this.props.location.pathname + '/' + m.id}>{m.name}</Link>
                        </List.Content>
                    </List.Item>
                )
            })
        }

        if (this.props.checkboxes) {
            return material.map(m => {
                return <div onSubmit={this.onSubmit} key={m.id}>
                    <CheckBox
                        name={m.id}
                        label={m.id + ' | ' + m.name}
                        isSelected={this.state.checkboxes[m.id]}
                        onCheckboxChange={this.onChange}
                        key={m.id}
                    />

                </div>
            })
        }

    }


    render() {
        return (
            <div>
                <List divided verticalAlign='middle'>
                    {this.createMaterialList()}
                </List>
            </div>
        )
    }
}

export default Material_Display