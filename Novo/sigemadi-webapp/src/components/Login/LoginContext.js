import {createContext} from 'react'

const contextDefaultValue = {
    token: undefined
}

const LoginContext = createContext(contextDefaultValue)

export default LoginContext
