import {
    DateTimeInput,
} from 'semantic-ui-calendar-react';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class DateTime extends Component {
    constructor (props) {
        super(props);

        this.state = {
            dateTime: '',
        };
    }

    currentTime() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        const hours = String(today.getHours())
        const minutes = String(today.getMinutes())

        today = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + minutes;
        return today
    }

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
        if (this.props.setDayTime) {
            this.props.setDayTime(value)
        }
    }

    render() {
        return (
            <Form>
                <DateTimeInput
                    name="dateTime"
                    placeholder="Day and Hour"
                    dateTimeFormat='YYYY-MM-DD HH:mm:SS'
                    value={this.state.dateTime}
                    iconPosition="left"
                    popupPosition='top left'
                    onChange={this.handleChange}
                    minDate={this.currentTime()}
                />

            </Form>
        );
    }
}
export default DateTime