// import React, { Component } from 'react'
// import ProfilePic from '../../assets/matthew.png'
// import { Card, Icon, Image } from 'semantic-ui-react'


// class LabManager extends Component {

//     state = { Person: ["Responsável de Laboratório","Docente"] }

//     render() {
//         return (
//             <Card centered>
//                 <Image src={ProfilePic} wrapped ui={false} />
//                 <Card.Content>
//                     <Card.Header>Matthew</Card.Header>
//                     <Card.Description>
//                         Papel Ativo: Responsável de Laboratório
//                     </Card.Description>
//                 </Card.Content>
//                 <Card.Content extra>
//                     <a>
//                         <p>
//                             <Icon name='users' />
//                             Cargos:
//                         </p>
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

// export default LabManager