import {
    DateInput,
} from 'semantic-ui-calendar-react';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class Date_Time extends Component {
    constructor (props) {
        super(props);

        this.state = {
            date: '',
        };
    }


    currentTime() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today
    }

    handleChange = (event, { name, value }) => {

        if (this.props.setDay) {
            this.props.setDay(value)
        }
    }

    render() {
        return (
            <Form>
                <DateInput
                    dateFormat='YYYY-MM-DD'
                    name="date"
                    placeholder="Data"
                    value={this.props.date}
                    iconPosition="left"
                    popupPosition='top left'
                    onChange={this.handleChange}
                    maxDate={this.currentTime()}
                />

            </Form>
        );
    }
}
export default Date_Time