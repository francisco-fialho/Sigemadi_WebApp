// import React, { Component } from 'react'
// import QrReader from 'react-qr-reader'

// class QrCode_Reader extends Component {

//     constructor (props) {
//         super(props)
//         this.state = {
//             result: 'No result',
//             material: props.location.data
//         }

//         this.onSubmit = this.onSubmit.bind(this)
//     }




//     //constraints => device id no component qr code

//     handleScan = data => {
//         if (data) {
//             this.setState({
//                 result: data
//             })
//         }
//     }
//     handleError = err => {
//         console.error(err)
//     }

//     onSubmit() {
//         const path = this.props.location.pathname.replace('/qrcode', '')
//         const materials = this.state.material
//         materials.push(this.state.result)
//         this.props.history.push({
//             pathname: path,
//             data: materials
//         })
//     }

//     render() {
//         return (
//             <div>
//                 <div className="ui cards">
//                     <div className="ui fluid card">
//                         <div className="content">
//                             <div className="header">
//                                 Leitura do QrCode
//                             </div>
//                             <div className="meta">
//                                 <div>
//                                     <QrReader
//                                         delay={300}
//                                         onError={this.handleError}
//                                         onScan={this.handleScan}
//                                         style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="description">
//                                 <h3>{this.state.result}</h3>
//                             </div>
//                         </div>

//                         <div className="extra content">

//                             <div className="ui two buttons">
//                                 <div className="ui basic green button" onClick={this.onSubmit}>Salvar</div>
//                                 <div className="ui basic red button">Cancelar</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }
// export default QrCode_Reader