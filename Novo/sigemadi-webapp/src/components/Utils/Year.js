import {
    YearInput
} from 'semantic-ui-calendar-react';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class YearCalendar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            year: '',
        };
    }


    currentTime() {
        var today = new Date();
        var yyyy = today.getFullYear();

        today = yyyy;
        return today
    }

    handleChange = (event, { name, value }) => {

        if (this.props.setYear) {
            this.props.setYear(value)
        }
    }

    render() {
        return (
            <Form>
                <YearInput
                    dateFormat='YYYY'
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
export default YearCalendar