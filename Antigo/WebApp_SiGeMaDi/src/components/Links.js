

const sci_areasUrl = 'http://localhost:1234/sigemadi/api/scientificareas'
const sci_areaUrl = 'http://localhost:1234/sigemadi/api/scientificareas/:id'
const subjectsUrl = 'http://localhost:1234/sigemadi/api/subjects'
const subjectUrl = 'http://localhost:1234/sigemadi/api/subjects/:id'
const subjectsSci_Area_By_IdUrl = 'http://localhost:1234/sigemadi/api/scientificareas/:sci_area_id/subjects'
const typesUrl = 'http://localhost:1234/sigemadi/api/types'
const typeUrl = 'http://localhost:1234/sigemadi/api/types/:id'
const typeSci_AreaUrl = 'http://localhost:1234/sigemadi/api/scientificareas/:sci_area_id/types'
const typeSci_Area_By_IdUrl = 'http://localhost:1234/sigemadi/api/scientificareas/:sci_area_id/types/:id'

const materialsUrl = 'http://localhost:1234/sigemadi/api/materials'
const materialUrl = 'http://localhost:1234/sigemadi/api/materials/:id'

const rolesUrl = 'http://localhost:1234/sigemadi/api/roles'
const userRolesUrl = 'http://localhost:1234/sigemadi/api/users/:id/roles'
const userUrl = 'http://localhost:1234/sigemadi/api/users/:id'
const usersUrl = 'http://localhost:1234/sigemadi/api/users'

const damagesUrl = 'http://localhost:1234/sigemadi/api/damages?solved=:flag'
const damagesStatesUrl = 'http://localhost:1234/sigemadi/api/damagesstates'
const damageUrl = 'http://localhost:1234/sigemadi/api/damages/:id'

const requestsUrl = 'http://localhost:1234/sigemadi/api/requests'
const requestUrl = 'http://localhost:1234/sigemadi/api/requests/:id'
const requestByUserUrl = 'http://localhost:1234/sigemadi/api/users/:id/requests'
const requestUpdateUrl = 'http://localhost:1234/sigemadi/api/requests/:id/materials'
const materialRequestUrl = 'http://localhost:1234/sigemadi/api/requests/:req_id/materials/:id'

const reservationsUserUrl = 'http://localhost:1234/sigemadi/api/users/:id/reservations'
const reservationsUrl = 'http://localhost:1234/sigemadi/api/reservations'
const reservationUrl = 'http://localhost:1234/sigemadi/api/reservations/:id'

const reportMaterialUrl = 'http://localhost:1234/sigemadi/api/materials/:id/damages'
const reportMaterialRequestUrl = 'http://localhost:1234/sigemadi/api/requests/:id/materials/:mId/damages'


export {
    sci_areasUrl,
    sci_areaUrl,
    subjectsUrl,
    subjectUrl,
    subjectsSci_Area_By_IdUrl,
    typesUrl,
    typeUrl,
    materialsUrl,
    materialUrl,
    rolesUrl,
    userRolesUrl,
    userUrl,
    usersUrl,
    typeSci_AreaUrl,
    typeSci_Area_By_IdUrl,
    damagesUrl,
    damageUrl,
    damagesStatesUrl,
    requestsUrl,
    requestUrl,
    requestByUserUrl,
    requestUpdateUrl,
    materialRequestUrl,
    reservationsUrl,
    reservationUrl,
    reservationsUserUrl,
    reportMaterialUrl,
    reportMaterialRequestUrl
}
