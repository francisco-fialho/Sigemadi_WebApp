import React from 'react'
import { toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import Page_404 from './Errors/Page404';
import Page_500 from './Errors/Page500';
import Page_400 from './Errors/Page400';

const Handler = (response) => {

    if (response === undefined) {
        toast({
            type: 'error',
            title: 'Something Went Wrong',
            time: 2000,
            size: 'mini',
            description: 'Something went wrong, please try again later!'
        })
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
            title: response.data.title || 'Something Went Wrong' ,
            time: 2000,
            size: 'mini',
            description: response.data.detail || 'Something went wrong, please try again later!',
            status: response.data.status
        })
        if (response.status == 400) {
            return <Page_400 />
        }
        if (response.status == 404) {
            return <Page_404 />
        }
        if (response.status == 500) {
            return <Page_500 />
        }
    }
}
export default Handler