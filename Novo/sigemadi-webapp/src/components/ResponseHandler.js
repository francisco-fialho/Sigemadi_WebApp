import React from 'react'
import { toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import Page404 from './Errors/Page404';
import Page500 from './Errors/Page500';
import Page400 from './Errors/Page400';
import { Redirect } from 'react-router-dom';

const Handler = (response) => {

    if (response === undefined) {
        toast({
            type: 'error',
            title: 'Something Went Wrong',
            time: 2000,
            size: 'mini',
            description: 'Something went wrong, please try again later!'
        })
        return <Page500 />
    }

    else if (response.status == 201 || response.status == 200) {
        toast({
            type: 'success',
            title: 'Success',
            time: 2000,
            size: 'mini',
            description: response.data.status,
            status: response.status
        })
    }

    else {
        toast({
            type: 'error',
            title: response.data.title || 'Something Went Wrong',
            time: 2000,
            size: 'mini',
            description: response.data.detail || 'Something went wrong, please try again later!',
            status: response.data.status
        })
        if (response.status == 400) {
            return <Page400 />
        }

        //VERIFICAR SE FOR 401 QUER DIZER QUE O TEMPO DO JWT CHEGOU AO FIM 
        if (response.status == 401) {
            localStorage.clear()
            return <Redirect to='/login' />

        }
        if (response.status == 404) {
            return <Page404 />
        }
        if (response.status == 500 || response.status == 504) {
            return <Page500 />
        }
    }
}
export default Handler