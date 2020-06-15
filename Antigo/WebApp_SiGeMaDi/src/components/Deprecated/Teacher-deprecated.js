// import React, { Component } from 'react'
// import ProfilePic from '../../assets/molly.png'
// import { Card, Icon, Image } from 'semantic-ui-react'

// class Teacher extends Component {
//     state = { Person: ["Docente","Responsável De Laboratório"] }

//     render() {
//         return (

//             <Card centered>
//                 <Image src={ProfilePic} wrapped ui={false} />
//                 <Card.Content>
//                     <Card.Header>Molly</Card.Header>
//                     <Card.Description>
//                         Papel Ativo: Docente
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

// export default Teacher