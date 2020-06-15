// import React, { Component } from 'react'
// import ProfilePic from '../../assets/steve.jpg'
// import { Card, Icon, Image } from 'semantic-ui-react'

// class Technician extends Component {
//     state = { Person: ["Técnico", "Funcionário"] }

//     render() {
//         return (

//             <Card centered>
//                 <Image src={ProfilePic} wrapped ui={false} />
//                 <Card.Content>
//                     <Card.Header>Steve</Card.Header>
//                     <Card.Description>
//                         Papel Ativo: Técnico
//                 </Card.Description>
//                 </Card.Content>
//                 <Card.Content extra>
//                     <a>
//                         <p>
//                             <Icon name='users' />
//                         Cargos:
//                     </p>
//                         {
//                             this.state.Person.map((role, idx) => {
//                                 if (idx + 1 === this.state.Person.length) {
//                                     return role
//                                 }
//                                 return role + ", "
//                             }
//                             )}
//                     </a>
//                 </Card.Content>
//             </Card>
//         )
//     }
// }

// export default Technician