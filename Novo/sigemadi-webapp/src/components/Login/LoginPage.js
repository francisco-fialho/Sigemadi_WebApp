import React, { useState } from 'react'
import { Form, Button, Grid, Header, Segment, Input, Message, Image } from 'semantic-ui-react';
import SigemadiLogo from '../../assets/SigemadiLogo.png'
import IselAdeetcLogo from '../../assets/IselAdeetcLogo.png'
import { SemanticToastContainer,toast } from 'react-semantic-toasts';


function LoginPage(props) {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    function handleChange(event) {
        if(event.target.name=='password') setPassword(event.target.value)
        else setUserName(event.target.value)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!(!userName || userName.trim().length === 0) && !(!password || password.trim().length === 0)) {
            await props.login(userName, password)
            props.onLogin()
        }
        else {
            toast({
                type:'warning',
                size:'mini',
                description:'Please insert a username and a password',
                title:'Something went wrong',
                time:2000
            })
            return Promise.resolve()
        }
    }
    return (
        <div>
        <SemanticToastContainer/>
            <Image src={SigemadiLogo} style={{ width: '8%', height: '8%' }} floated='right' />
            <Image src={IselAdeetcLogo} size='small' floated='left' />
            <Grid centered style={{ marginTop: 125, display:'inline-block' }}>
                <Grid.Column style={{ maxWidth: 380 }}>
                    <Header textAlign="center">
                        SiGeMaDi
                    </Header>
                    <Form size="large" onSubmit={handleSubmit}>
                        <Segment>
                            <Form.Field>
                                <Input iconPosition="left" icon="user" type='text' name='username' placeholder='Your username' onChange={handleChange} />
                            </Form.Field>
                            <Form.Field>
                                <Input iconPosition="left" icon="key" type='password' name='password' placeholder='Your password' onChange={handleChange} />
                            </Form.Field>
                            <Button fluid size="large" type='submit' content="Sign in" icon="sign in" />
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default LoginPage