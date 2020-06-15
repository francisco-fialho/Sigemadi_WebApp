import React, { useEffect, useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

function Profile_Page(props) {

    const [user, setUser] = useState({
        roles: []
    })

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userinfo'))

        setUser(userInfo)
    }, [])


    return (
        <Card centered>
            <Image src={`data:image/jpeg;base64,${user.photo}`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{user.name}</Card.Header>
                <Card.Description>
                    Active Role: {props.role}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <a>
                    <p>
                        <Icon name='users' />
                            Roles:
                        </p>
                    {
                        user.roles.map((role, idx) => {
                            if (idx + 1 === user.roles.length) {
                                return role.name
                            }
                            return role.name + ", "
                        }
                        )}
                </a>
            </Card.Content>
        </Card>
    )
}


export default Profile_Page