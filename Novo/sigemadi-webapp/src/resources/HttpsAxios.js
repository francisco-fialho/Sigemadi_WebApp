import https from 'https'

import axios from 'axios'
import file from './bootsecurity.crt'
import key from './bootsecurity.key'
import { useEffect } from 'react'

const httpsAgent = new https.Agent({
    cert:file,
    key:key
})

//adicionar header authorization com o token
let httpsAxios = axios.create({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })


export default httpsAxios