import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { damagesUrl } from '../../Links'
import { SemanticToastContainer } from 'react-semantic-toasts';
import Response_Handler from '../../ResponseHandler'
import { Header, Card, Button, Grid, Divider } from 'semantic-ui-react'



function Damaged_Material(props) {

    function buildMaterialList() {
        return props.material.map(m => {
            return (
                <Grid.Column>
                    <Card centered>
                        <Card.Header> {m.material} </Card.Header>
                        <Card.Content extra>
                            <Button fluid content='See Report' icon='bug' onClick={() => props.history.push(props.location.pathname + '/' + m.id)}></Button>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            )
        })

    }

    const style = {
        height: 30,
        margin: 6,
        padding: 8
    }

    return (
        <div>
            <SemanticToastContainer />
            <Header size='medium' id="title">{props.title}</Header>
            <Divider/>
            {
                (props.material.length === 0 && !props.moreData) ? <Header size='small' >There is no Damages Reported</Header> :
                    <Grid columns={4} style={style}>
                        {
                            buildMaterialList()
                        }
                    </Grid>
            }
        </div>
    )
}


export default Damaged_Material