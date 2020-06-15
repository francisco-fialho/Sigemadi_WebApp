import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from "history"
import App from './components/App'
import Roles from './components/Roles'

/** HEADERS */
import Header_Staff from './components/Headers/HeaderStaff'
import Header_Admin from './components/Headers/HeaderAdmin'
import Header_Tech from './components/Headers/HeaderTech'
import Header_Teacher from './components/Headers/HeaderTeacher'
import HeaderLabManager from './components/Headers/HeaderLabManager'
import './index.css'

/** MATERIAL */
import Material from './components/Material'
import Material_Details from './components/MaterialDetails'

/** STAFF */
import Staff from './components/Staff/Staff'
import Request from './components/Staff/Request'
import Request_Details from './components/Staff/RequestDetails'
import Material_Request from './components/Staff/MaterialRequest'
import Checkout_Request from './components/Staff/CheckoutRequest'
import Report_Material from './components/ReportMaterial'

/** ADMINISTRATOR */
import Users_Roles from './components/Administrator/UsersRoles'
import Define_Roles from './components/Administrator/DefineRoles'
import Scientific_Areas_Management from './components/Administrator/ScientificAreasManagement'

/** TEACHER */
import Material_Reservation from './components/Teacher/MaterialReservation'
import Checkout_Reservation from './components/Teacher/CheckoutReservation'

/** TECHNICIAN */
import Damaged_Material from './components/Technician/Damage_Materials/DamagedMaterialActive'
import Damaged_Material_Details from './components/Technician/Damage_Details/DamageMaterialActiveDetails'
import History_Material_Details from './components/Technician/Damage_Details/DamagedMaterialHistoryDetails'
import Damaged_Material_History from './components/Technician/Damage_Materials/DamagedMaterialHistory'

/** LAB MANAGER */
import Material_Management from './components/LabManager/Material_Management/MaterialManagement'
import New_Material from './components/LabManager/Material_Management/NewMaterial'
import New_Type from './components/LabManager/Type_Management/NewType'
import Reservation from './components/Teacher/Reservation'
import Reservation_Details from './components/Teacher/ReservationDetails'
import Subjects_Management from './components/Administrator/SubjectsManagement'
import Type_Management from './components/LabManager/Type_Management/TypeManagement'

import Page_404 from './components/Errors/Page404'

import Profile_Page from './components/ProfilePage'

//<Route path='/auth/staff/request/:rId/report/:id' render={(props) => <Header_Staff><Report_Material {...props} /> </Header_Staff>} />


ReactDOM.render(
    <Router history={createBrowserHistory()}>
        <Switch>
            <Route exact path='/' render={(props) => <App {...props} />} />
            <Route path='/auth/roles' render={(props) => <Roles />} />

            <Route exact path='/auth/staff' render={(props) => <Header_Staff><Staff {...props} /> </Header_Staff>} />
            <Route exact path='/auth/staff/material' render={(props) => <Header_Staff><Material {...props} /> </Header_Staff>} />

            <Route path='/auth/staff/material/:id' render={(props) => <Header_Staff><Material_Details {...props} /> </Header_Staff>} />

            <Route exact path='/auth/staff/request' render={(props) => <Header_Staff><Request {...props} /> </Header_Staff>} />

            <Route exact path='/auth/staff/request/:id' render={(props) => <Header_Staff><Request_Details {...props} /> </Header_Staff>} />

            <Route exact path='/auth/staff/newrequest' render={(props) => <Header_Staff><Material_Request {...props} /> </Header_Staff>} />

            <Route path='/auth/staff/newrequest/checkout' render={(props) => <Header_Staff><Checkout_Request {...props} newRequest /> </Header_Staff>} />

            <Route exact path='/auth/staff/request/:id/material' render={(props) => <Header_Staff><Material_Request {...props} /> </Header_Staff>} />

            <Route path='/auth/staff/request/:id/checkout' render={(props) => <Header_Staff><Checkout_Request {...props} /> </Header_Staff>} />

            <Route path='/auth/staff/report/:id' render={(props) => <Header_Staff><Report_Material {...props} /> </Header_Staff>} />

            <Route exact path='/auth/admin' render={(props) => <Header_Admin><Profile_Page role='Administrator' /> </Header_Admin>} />

            <Route exact path='/auth/admin/usersroles' render={(props) => <Header_Admin><Users_Roles {...props} /> </Header_Admin>} />

            <Route path='/auth/admin/usersroles/:id' render={(props) => <Header_Admin><Define_Roles {...props} /> </Header_Admin>} />

            <Route exact path='/auth/admin/areas' render={(props) => <Header_Admin><Scientific_Areas_Management {...props} /> </Header_Admin>} />

            <Route path='/auth/admin/areas/:id/course' render={(props) => <Header_Admin><Subjects_Management {...props} /> </Header_Admin>} />

            <Route exact path='/auth/teacher' render={(props) => <Header_Teacher><Profile_Page role='Teacher' /> </Header_Teacher>} />
            <Route exact path='/auth/teacher/material' render={(props) => <Header_Teacher><Material {...props} /> </Header_Teacher>} />

            <Route path='/auth/teacher/material/:id' render={(props) => <Header_Teacher><Material_Details {...props} /> </Header_Teacher>} />

            <Route path='/auth/teacher/report/:id' render={(props) => <Header_Teacher><Report_Material {...props} /> </Header_Teacher>} />

            <Route exact path='/auth/teacher/reservation' render={(props) => <Header_Teacher><Reservation {...props} /> </Header_Teacher>} />

            <Route exact path='/auth/teacher/reservation/:id' render={(props) => <Header_Teacher><Reservation_Details {...props} /> </Header_Teacher>} />

            <Route exact path='/auth/teacher/reservation/:id/material' render={(props) => <Header_Teacher><Material_Reservation {...props} /> </Header_Teacher>} />

            <Route exact path='/auth/teacher/reservation/:id/checkout' render={(props) => <Header_Teacher><Checkout_Reservation {...props} /> </Header_Teacher>} />

            <Route exact path='/auth/teacher/newreservation' render={(props) => <Header_Teacher><Material_Reservation {...props} /> </Header_Teacher>} />

            <Route path='/auth/teacher/newreservation/checkout' render={(props) => <Header_Teacher><Checkout_Reservation {...props} newReservation /> </Header_Teacher>} />

            <Route exact path='/auth/tech' render={(props) => <Header_Tech><Profile_Page role='Technician' /> </Header_Tech>} />
            <Route exact path='/auth/tech/damages' render={(props) => <Header_Tech><Damaged_Material {...props} /> </Header_Tech>} />

            <Route path='/auth/tech/damages/:id' render={(props) => <Header_Tech><Damaged_Material_Details {...props} /> </Header_Tech>} />

            <Route exact path='/auth/tech/history' render={(props) => <Header_Tech><Damaged_Material_History {...props} /> </Header_Tech>} />

            <Route path='/auth/tech/history/:id' render={(props) => <Header_Tech><History_Material_Details {...props} /> </Header_Tech>} />

            <Route exact path='/auth/labmanager' render={(props) => <HeaderLabManager><Profile_Page role='Laboratory Responsible' /> </HeaderLabManager>} />

            <Route exact path='/auth/labmanager/material' render={(props) => <HeaderLabManager><Material_Management {...props} /> </HeaderLabManager>} />

            <Route exact path='/auth/labmanager/type' render={(props) => <HeaderLabManager><Type_Management {...props} /> </HeaderLabManager>} />

            <Route path='/auth/labmanager/material/:id' render={(props) => <HeaderLabManager><Material_Details {...props} /> </HeaderLabManager>} />

            <Route path='/auth/labmanager/report/:id' render={(props) => <HeaderLabManager><Report_Material {...props} /> </HeaderLabManager>} />

            <Route path='/auth/labmanager/addmaterial' render={(props) => <HeaderLabManager><New_Material {...props} /> </HeaderLabManager>} />

            <Route path='/auth/labmanager/addtype' render={(props) => <HeaderLabManager><New_Type {...props} /> </HeaderLabManager>} />
            <Route path='*' render={() => <Page_404 home></Page_404>} />

        </Switch>
    </Router>
    , document.getElementById('root'))