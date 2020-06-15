import {
    DateInput,
} from 'semantic-ui-calendar-react';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class DateCalendar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            date: '',
        };
    }


    currentTime() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

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
export default DateCalendar