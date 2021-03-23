import React, { Component } from "react";
import DateTimePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default class DatePicker extends Component {
	render() {
		const { input: { value, onChange }} = this.props;
		return(
				<React.Fragment>
					<div className="col-3">
						<label className="col-form-label font-weight-bold" htmlFor={this.props.id}>{this.props.label}:</label>
					</div>
					<div className="col-9">
                        <DateTimePicker 
                            name = { this.props.name }
                            id = { this.props.id }
                            type = { this.props.type }
                            value = { value }
                            onChange = { onChange }
                            className="form-control"
                            placeholderText= {this.props.placeholder}
                            showTimeSelect
                            selected= { value }
                            dateFormat= "yyyy-MM-dd h:mm aa"
                            required />
					</div>
				</React.Fragment>
		);
	}
}