// import React, { Component } from 'react'
// import ProfilePicMatthew from '../../assets/matthew.png'
// import ProfilePicJenny from '../../assets/jenny.jpg'
// import ProfilePicElliot from '../../assets/elliot.jpg'

// //PODE SER CONVERTIDO EM FUNÇÃO EM VEZ DE CLASS
// class Checkout_Existent_Request extends Component {

//     constructor (props) {
//         super(props)
//         this.onSubmit = this.onSubmit.bind(this)
//     }

//     state = {
//         material: null,
//         id: null,
//         person: {
//             id: 'A44813',
//             name: 'Francisco',
//             photo: ProfilePicMatthew
//         },
//     }

//     componentWillMount() {
//         //adicionar a pessoa
//         //FAZER O PEDIDO GET USER PARA TER A FOTO e afetar o state com a pessoa que é retornada
//         const data = this.props.location.data
//         if (this.props.location.data != null) {
//             this.setState({ material: data.material, id: data.id })
//         }
//         else {
//             alert('Tenho que resolver o refresh porque fica sem material')
//             //REFRESH REVER ISTO !!!!!!!!!!!!!!!!!!!
//             this.props.history.push('/auth/staff/newrequest')
//             return
//         }
//     }



//     //TENHO QUE IR BUSCAR CADA MATERIAL NAO UNITARIO PARA PODER METER O MAX = AVAILABLE OU METO UM CERTO VALOR 10?
//     buildMaterialInfo() {
//         if (!this.state.material) return
//         return (<div className="ui large divided list">
//             {
//                 this.state.material.map(material => {
//                     if (!material.uni) {
//                         return <div className="item" key={material.id}>
//                             <div className="content">
//                                 <div className="left floated header">{material.name}</div>
//                             </div>
                            
//                             <div className="right floated description" ><input id={material.id} type="number" required placeholder="Quantidade" min='1' max='10'></input></div>
//                         </div>

//                     } else {
//                         return <div className="item" key={material.id}>
//                             <div className="content">
//                                 <div className="left floated header">{material.name}</div>
//                             </div>
//                             <div className="right floated description" >{this.state.name}</div>
//                         </div>
//                     }
//                 })
//             }
//         </div>
//         )
//     }

//     onSubmit() {
//         //pedido de requisição
//         this.props.history.push(`/auth/staff/request/${this.state.id}`)
//     }

//     render() {
//         return (
//             <div>
//                 <div style={{ display: 'inline-block' }}>
//                     <div className="ui centered floated card">
//                         <div className="image">
//                             <img src={this.state.person.photo} />
//                         </div>
//                         <div className="content">
//                             <h1 className="ui header">{this.state.person.name}</h1>
//                             <div className="meta">
//                                 <span>{this.state.person.id}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <hr />
//                 <div style={{ display: 'inline-block', float: 'right' }} className="ui large basic button" onClick={this.onSubmit}><i className="icon edit alternate"></i> Requisitar </div>

//                 <div style={{ display: 'block' }}>
//                     <h3>Material:</h3>
//                     {this.buildMaterialInfo(this)}
//                 </div>
//             </div>
//         )
//     }
// }
// export default Checkout_Existent_Request