import {
    MonthInput
} from 'semantic-ui-calendar-react';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class MonthCalendar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            month: '',
        };
    }


    currentTime() {
        var today = new Date();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm;
        return today
    }

    handleChange = (event, { name, value }) => {

        if (this.props.setMonth) {
            this.props.setMonth(value)
        }
    }

    render() {
        return (
            <Form>
                <MonthInput
                    dateFormat='YYYY-MM'
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
export default MonthCalendar