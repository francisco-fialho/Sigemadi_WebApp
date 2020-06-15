const BASE_URL = 'http://10.62.73.30:8085/sigemadi/api'

const sci_areasUrl = `${BASE_URL}/scientificareas`
const sci_areaUrl = `${BASE_URL}/scientificareas/:id`
const subjectsUrl = `${BASE_URL}/subjects`
const subjectUrl = `${BASE_URL}/subjects/:id`
const subjectsSci_Area_By_IdUrl = `${BASE_URL}/scientificareas/:sciAreaId/subjects`
const typesUrl = `${BASE_URL}/types`
const typeUrl = `${BASE_URL}/types/:id`
const typeSci_AreaUrl = `${BASE_URL}/scientificareas/:sciAreaId/types`
const typeSci_Area_By_IdUrl = `${BASE_URL}/scientificareas/:sciAreaId/types/:id`

const materialsUrl = `${BASE_URL}/materials`
const materialUrl = `${BASE_URL}/materials/:id`

const rolesUrl = `${BASE_URL}/roles`
const userRolesUrl = `${BASE_URL}/users/:id/roles`
const userUrl = `${BASE_URL}/users/:id`
const usersUrl = `${BASE_URL}/users`

const damagesUrl = `${BASE_URL}/damages?solved=:flag`
const damagesStatesUrl = `${BASE_URL}/damagesstates`
const damageUrl = `${BASE_URL}/damages/:id`

const requestsUrl = `${BASE_URL}/requests`
const requestUrl = `${BASE_URL}/requests/:id`
const requestByUserUrl = `${BASE_URL}/users/:id/requests`
const requestUpdateUrl = `${BASE_URL}/requests/:id/materials`
const materialRequestUrl = `${BASE_URL}/requests/:reqId/materials/:id`

const reservationsUserUrl = `${BASE_URL}/users/:id/reservations`
const reservationsUrl = `${BASE_URL}/reservations`
const reservationUrl = `${BASE_URL}/reservations/:id`

const reportMaterialUrl = `${BASE_URL}/materials/:id/damages`
//const reportMaterialRequestUrl = `${BASE_URL}/requests/:id/materials/:mId/damages`
const reportSubmissionUrl = `${BASE_URL}/requests/:reqId/materials/:id`


const topTenMostUsedMaterialTypesStatistic = `${BASE_URL}/statistics/toptenmostusedmaterialtypes`
const topTenMostUsedMaterialStatistic = `${BASE_URL}/statistics/toptenmostusedmaterials`
const damagePerTypeStatistic = `${BASE_URL}/statistics/damagespertype`
const damagedMaterialStatistic = `${BASE_URL}/statistics/damagedmaterials`
const averageTimeToRepairStatistic = `${BASE_URL}/statistics/averagetimetorepair`
const numberOfRequestedHoursPerTypeStatistic = `${BASE_URL}/statistics/numberofrequestedhourspertype`
const numberOfRequestedHoursPerMaterialStatistic = `${BASE_URL}/statistics/numberofrequestedhourspermaterial`
const requestsPerTypeByDayStatistic = `${BASE_URL}/statistics/requestspertypebyday`
const requestsPerTypeByMonthStatistic = `${BASE_URL}/statistics/requestspertypebymonth`
const requestsPerTypeByYearStatistic = `${BASE_URL}/statistics/requestspertypebyyear`


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
    reportSubmissionUrl,
    topTenMostUsedMaterialTypesStatistic,
    topTenMostUsedMaterialStatistic,
    damagePerTypeStatistic,
    damagedMaterialStatistic,
    averageTimeToRepairStatistic,
    numberOfRequestedHoursPerTypeStatistic,
    numberOfRequestedHoursPerMaterialStatistic,
    requestsPerTypeByDayStatistic,
    requestsPerTypeByMonthStatistic,
    requestsPerTypeByYearStatistic
}
