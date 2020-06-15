// import React, { Component } from 'react'
// import ProfilePic from '../../assets/jenny.jpg'
// import { Card, Icon, Image } from 'semantic-ui-react'

// class Administrator extends Component {
//     state = { Person: ["Administrador"] }

//     render() {
//         return (
//             //ADICIONAR NOS CARGOS UM DROPDOWN PARA ATRIBUIR AREA CIENTIFICA DO RESPONSAVEL DE LABORATÓRIO

//             //CASO NAO ESTEJA TUDO COMO DEVE DE SER, TIPO FAZER CHECK NO RESPONSAVEL E NAO METER A AREA CIENTIFICA 
//             <Card centered>
//                 <Image src={ProfilePic} wrapped ui={false} />
//                 <Card.Content>
//                     <Card.Header>Jenny</Card.Header>
//                     <Card.Description>
//                         Papel Ativo: Administrador
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

// export default Administrator