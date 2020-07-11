import React, { useState, Component } from 'react'

import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from "history"

import '../index.css'
import CustomRoute from '../components/CustomRoute'
import Home from './Home'
import LoginPage from './Login/LoginPage'
import Roles from './Roles'

import HeaderStaff from './Headers/HeaderStaff'
import HeaderAdmin from './Headers/HeaderAdmin'
import HeaderTech from './Headers/HeaderTech'
import HeaderTeacher from './Headers/HeaderTeacher'
import HeaderLabManager from './Headers/HeaderLabManager'

/** MATERIAL **/
import Material from './Material'
import MaterialDetails from './MaterialDetails'

/** STAFF **/
import Staff from './Staff/Staff'
import Request from './Staff/Requests'
import RequestDetails from './Staff/RequestDetails'
import MaterialRequest from './Staff/MaterialRequest'
import CheckoutRequest from './Staff/CheckoutRequest'
import ReportMaterial from './ReportMaterial'

/** ADMINISTRATOR **/
import UsersRoles from './Administrator/UsersRoles'
import DefineRoles from './Administrator/DefineRoles'
import ScientificAreasManagement from './Administrator/ScientificAreasManagement'

/** TEACHER **/
import MaterialReservation from './Teacher/MaterialReservation'
import CheckoutReservation from './Teacher/CheckoutReservation'
import Reservation from './Teacher/Reservations'
import ReservationDetails from './Teacher/ReservationDetails'

/** TECHNICIAN **/
import DamagedMaterial from './Technician/DamageMaterials/DamagedMaterialActive'
import DamagedMaterialDetails from './Technician/DamageDetails/DamageMaterialActiveDetails'
import HistoryMaterialDetails from './Technician/DamageDetails/DamagedMaterialHistoryDetails'
import DamagedMaterialHistory from './Technician/DamageMaterials/DamagedMaterialHistory'

/** LAB MANAGER **/
import MaterialManagement from './LabManager/MaterialManagement/MaterialManagement'
import NewMaterial from './LabManager/MaterialManagement/NewMaterial'
import NewType from './LabManager/TypeManagement/NewType'
import SubjectsManagement from './Administrator/SubjectsManagement'
import TypeManagement from './LabManager/TypeManagement/TypeManagement'

import Page404 from './Errors/Page404'

import ProfilePage from './ProfilePage'
import Statistics from './Statistics'
import LoginContext from './Login/LoginContext'
import Login from './Login/Login'


class App extends Component {

    static contextType = LoginContext

    // constructor(props,context){
    //     super(props,context)
    //     this.state={
    //         isLoggedIn:this.context.checkLoggedIn()
    //     }
    // }


    handleLogin = () => {
        this.setState({ isLoggedIn: this.context.checkLoggedIn() })
    }
    //<Route exact path='/' render={(props) => <Home {...props} />} />
    // <CustomRoute exact path='/login' >
    //                     {shouldLogIn ? <LoginPage login={this.context.login} onLogin={this.handleLogin} /> : <Redirect to='/auth/roles' />}
    //                 </CustomRoute>
    render() {
        const shouldLogIn = !this.state || !this.state.isLoggedIn
        return (
            <Router history={createBrowserHistory()}>
                <Switch>
                    <CustomRoute exact path='/' render={(props) => <Home {...props} />} />

                    <CustomRoute exact path='/login' render={() => <Login></Login>} />

                    <CustomRoute path='/auth/roles' render={(props) => <Roles {...props} />} />

                    <CustomRoute role='staff' exact path='/auth/staff' render={(props) => <HeaderStaff><Staff {...props} /> </HeaderStaff>} />
                    <CustomRoute role='staff' exact path='/auth/staff/material' render={(props) => <HeaderStaff><Material {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' exact path='/auth/staff/material/:id' render={(props) => <HeaderStaff><MaterialDetails {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' exact path='/auth/staff/request' render={(props) => <HeaderStaff><Request {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' exact path='/auth/staff/request/:id' render={(props) => <HeaderStaff><RequestDetails {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' exact path='/auth/staff/newrequest/material' render={(props) => <HeaderStaff><MaterialRequest {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' path='/auth/staff/newrequest/material/checkout' render={(props) => <HeaderStaff><CheckoutRequest {...props} newRequest /> </HeaderStaff>} />

                    <CustomRoute role='staff' exact path='/auth/staff/request/:id/material' render={(props) => <HeaderStaff><MaterialRequest {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' path='/auth/staff/request/:id/material/checkout' render={(props) => <HeaderStaff><CheckoutRequest {...props} /> </HeaderStaff>} />

                    <CustomRoute role='staff' path='/auth/staff/material/:id/report' render={(props) => <HeaderStaff><ReportMaterial {...props} /> </HeaderStaff>} />

                    <CustomRoute role='administrator' exact path='/auth/admin' render={(props) => <HeaderAdmin><ProfilePage role='Administrator' /> </HeaderAdmin>} />
                    <CustomRoute role='administrator' exact path='/auth/admin/usersroles' render={(props) => <HeaderAdmin><UsersRoles {...props} /> </HeaderAdmin>} />

                    <CustomRoute role='administrator' path='/auth/admin/usersroles/:id' render={(props) => <HeaderAdmin><DefineRoles {...props} /> </HeaderAdmin>} />

                    <CustomRoute role='administrator' exact path='/auth/admin/areas' render={(props) => <HeaderAdmin><ScientificAreasManagement {...props} /> </HeaderAdmin>} />

                    <CustomRoute role='administrator' path='/auth/admin/areas/:id/course' render={(props) => <HeaderAdmin><SubjectsManagement {...props} /> </HeaderAdmin>} />

                    <CustomRoute role='administrator' path='/auth/admin/statistics' render={(props) => <HeaderAdmin><Statistics /> </HeaderAdmin>} />

                    <CustomRoute role='teacher' exact path='/auth/teacher' render={(props) => <HeaderTeacher><ProfilePage role='Teacher' /> </HeaderTeacher>} />
                    <CustomRoute role='teacher' exact path='/auth/teacher/material' render={(props) => <HeaderTeacher><Material {...props} /> </HeaderTeacher>} />

                    <CustomRoute role='teacher' path='/auth/teacher/material/:id' render={(props) => <HeaderTeacher><MaterialDetails {...props} /> </HeaderTeacher>} />

                    <CustomRoute role='teacher' exact path='/auth/teacher/reservation' render={(props) => <HeaderTeacher><Reservation {...props} /> </HeaderTeacher>} />

                    <CustomRoute role='teacher' exact path='/auth/teacher/reservation/:id' render={(props) => <HeaderTeacher><ReservationDetails {...props} /> </HeaderTeacher>} />

                    <CustomRoute role='teacher' exact path='/auth/teacher/newreservation/types' render={(props) => <HeaderTeacher><MaterialReservation {...props} /> </HeaderTeacher>} />

                    <CustomRoute role='teacher' path='/auth/teacher/newreservation/types/checkout' render={(props) => <HeaderTeacher><CheckoutReservation {...props} newReservation /> </HeaderTeacher>} />

                    <CustomRoute role='technician' exact path='/auth/tech' render={(props) => <HeaderTech><ProfilePage role='Technician' /> </HeaderTech>} />
                    <CustomRoute role='technician' exact path='/auth/tech/damages' render={(props) => <HeaderTech><DamagedMaterial {...props} /> </HeaderTech>} />

                    <CustomRoute role='technician' path='/auth/tech/damages/:id' render={(props) => <HeaderTech><DamagedMaterialDetails {...props} /> </HeaderTech>} />

                    <CustomRoute role='technician' exact path='/auth/tech/history' render={(props) => <HeaderTech><DamagedMaterialHistory {...props} /> </HeaderTech>} />

                    <CustomRoute role='technician' path='/auth/tech/history/:id' render={(props) => <HeaderTech><HistoryMaterialDetails {...props} /> </HeaderTech>} />

                    <CustomRoute role='labmanager' exact path='/auth/labmanager' render={(props) => <HeaderLabManager><ProfilePage role='Laboratory Responsible' /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' exact path='/auth/labmanager/statistics' render={(props) => <HeaderLabManager><Statistics /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' exact path='/auth/labmanager/material' render={(props) => <HeaderLabManager><MaterialManagement {...props} /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' exact path='/auth/labmanager/type' render={(props) => <HeaderLabManager><TypeManagement {...props} /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' path='/auth/labmanager/material/:id' render={(props) => <HeaderLabManager><MaterialDetails {...props} /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' path='/auth/labmanager/addmaterial' render={(props) => <HeaderLabManager><NewMaterial {...props} /> </HeaderLabManager>} />

                    <CustomRoute role='labmanager' path='/auth/labmanager/addtype' render={(props) => <HeaderLabManager><NewType {...props} /> </HeaderLabManager>} />

                    <Route path='*' render={() => <Page404 home></Page404>} />
                </Switch>
            </Router>
        )
    }
}

 
//<Route exact path='/' render={(props) => <Home {...props} />} />
//     <Route exact path='/login'>
//         {shouldLogIn ?
//             <LoginPage login={this.context.login} onLogin={this.handleLogin} /> :
//             <Redirect to="/auth/roles" />
//         }
//     </Route>

// <Route path='/auth/roles' render={(props) => <Roles {...props} />} />

// <Route exact path='/auth/staff' render={(props) => <HeaderStaff><Staff {...props} /> </HeaderStaff>} />
// <Route exact path='/auth/staff/material' render={(props) => <HeaderStaff><Material {...props} /> </HeaderStaff>} />

// <Route exact path='/auth/staff/material/:id' render={(props) => <HeaderStaff><MaterialDetails {...props} /> </HeaderStaff>} />

// <Route exact path='/auth/staff/request' render={(props) => <HeaderStaff><Request {...props} /> </HeaderStaff>} />

// <Route exact path='/auth/staff/request/:id' render={(props) => <HeaderStaff><RequestDetails {...props} /> </HeaderStaff>} />

// <Route exact path='/auth/staff/newrequest/material' render={(props) => <HeaderStaff><MaterialRequest {...props} /> </HeaderStaff>} />

// <Route path='/auth/staff/newrequest/material/checkout' render={(props) => <HeaderStaff><CheckoutRequest {...props} newRequest /> </HeaderStaff>} />

// <Route exact path='/auth/staff/request/:id/material' render={(props) => <HeaderStaff><MaterialRequest {...props} /> </HeaderStaff>} />

// <Route path='/auth/staff/request/:id/material/checkout' render={(props) => <HeaderStaff><CheckoutRequest {...props} /> </HeaderStaff>} />

// <Route path='/auth/staff/material/:id/report' render={(props) => <HeaderStaff><ReportMaterial {...props} /> </HeaderStaff>} />

//<Route exact path='/auth/admin' render={(props) => <HeaderAdmin><ProfilePage role='Administrator' /> </HeaderAdmin>} />

// <Route exact path='/auth/admin/usersroles' render={(props) => <HeaderAdmin><UsersRoles {...props} /> </HeaderAdmin>} />

// <Route path='/auth/admin/usersroles/:id' render={(props) => <HeaderAdmin><DefineRoles {...props} /> </HeaderAdmin>} />

// <Route exact path='/auth/admin/areas' render={(props) => <HeaderAdmin><ScientificAreasManagement {...props} /> </HeaderAdmin>} />

// <Route path='/auth/admin/areas/:id/course' render={(props) => <HeaderAdmin><SubjectsManagement {...props} /> </HeaderAdmin>} />

// <Route path='/auth/admin/statistics' render={(props) => <HeaderAdmin><Statistics /> </HeaderAdmin>} />

// <Route exact path='/auth/teacher' render={(props) => <HeaderTeacher><ProfilePage role='Teacher' /> </HeaderTeacher>} />
// <Route exact path='/auth/teacher/material' render={(props) => <HeaderTeacher><Material {...props} /> </HeaderTeacher>} />

// <Route path='/auth/teacher/material/:id' render={(props) => <HeaderTeacher><MaterialDetails {...props} /> </HeaderTeacher>} />

// <Route exact path='/auth/teacher/reservation' render={(props) => <HeaderTeacher><Reservation {...props} /> </HeaderTeacher>} />

// <Route exact path='/auth/teacher/reservation/:id' render={(props) => <HeaderTeacher><ReservationDetails {...props} /> </HeaderTeacher>} />

// <Route exact path='/auth/teacher/newreservation/types' render={(props) => <HeaderTeacher><MaterialReservation {...props} /> </HeaderTeacher>} />

// <Route path='/auth/teacher/newreservation/types/checkout' render={(props) => <HeaderTeacher><CheckoutReservation {...props} newReservation /> </HeaderTeacher>} />

// <Route exact path='/auth/tech' render={(props) => <HeaderTech><ProfilePage role='Technician' /> </HeaderTech>} />
// <Route exact path='/auth/tech/damages' render={(props) => <HeaderTech><DamagedMaterial {...props} /> </HeaderTech>} />

// <Route path='/auth/tech/damages/:id' render={(props) => <HeaderTech><DamagedMaterialDetails {...props} /> </HeaderTech>} />

// <Route exact path='/auth/tech/history' render={(props) => <HeaderTech><DamagedMaterialHistory {...props} /> </HeaderTech>} />

// <Route path='/auth/tech/history/:id' render={(props) => <HeaderTech><HistoryMaterialDetails {...props} /> </HeaderTech>} />

// <Route exact path='/auth/labmanager' render={(props) => <HeaderLabManager><ProfilePage role='Laboratory Responsible' /> </HeaderLabManager>} />

// <Route exact path='/auth/labmanager/statistics' render={(props) => <HeaderLabManager><Statistics /> </HeaderLabManager>} />

// <Route exact path='/auth/labmanager/material' render={(props) => <HeaderLabManager><MaterialManagement {...props} /> </HeaderLabManager>} />

// <Route exact path='/auth/labmanager/type' render={(props) => <HeaderLabManager><TypeManagement {...props} /> </HeaderLabManager>} />

// <Route path='/auth/labmanager/material/:id' render={(props) => <HeaderLabManager><MaterialDetails {...props} /> </HeaderLabManager>} />

// <Route path='/auth/labmanager/addmaterial' render={(props) => <HeaderLabManager><NewMaterial {...props} /> </HeaderLabManager>} />

// <Route path='/auth/labmanager/addtype' render={(props) => <HeaderLabManager><NewType {...props} /> </HeaderLabManager>} />



export default App;