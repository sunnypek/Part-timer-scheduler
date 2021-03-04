import React, { Component } from 'react';
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";

import * as adminActions  from "../actions/addTimeslot";
import CustomInput from "./CustomInput";

class AddTimeslot extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	async onSubmit(formData) {
		await this.props.addTimeslot(formData);
	}
	
	render() {
		const { handleSubmit } = this.props;

		let alert;
		
		if (this.props.err) {
			alert = <div className="alert alert-danger" role="alert">Please check that all data are entered correctly! (make sure ID is not in use)</div>;
		} else {
			if (this.props.message === "SUCCESS") {
				alert = <div className="alert alert-success" role="alert">Successfully added timeslot!</div>;
			} else {
				alert = "";
			}
		}

		return (
			<div className="row justify-content-center">
				<div className="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-10">
					<form onSubmit= { handleSubmit(this.onSubmit) }>
						<fieldset>
							<Field 
								name="timeslotID"
								type="text"
								id="timeslotID"
								label="Timeslot ID"
								placeholder="Enter a timeslot ID"
								component={ CustomInput } />
						</fieldset>
						<fieldset>
							<Field 
								name="startDateTime"
								type="text"
								id="startDateTime"
								label="Start date and time"
								placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS"
								component={ CustomInput } />
						</fieldset>
						<fieldset>
							<Field 
								name="endDateTime"
								type="text"
								id="endDateTime"
								label="End date and time"
								placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS"
								component={ CustomInput } />
						</fieldset>
						<fieldset>
							<Field 
								name="createdBy"
								type="text"
								id="createdBy"
								label="Created by"
								placeholder="Enter your name"
								component={ CustomInput } />
						</fieldset>
						<fieldset>
							<Field 
								name="normalRate"
								type="text"
								id="normalRate"
								label="Normal rate"
								placeholder="Normal rate per hour for this job"
								component={ CustomInput } />
						</fieldset>
						<fieldset>
							<Field 
								name="overtimeRate"
								type="text"
								id="overtimeRate"
								label="Overtime rate"
								placeholder="Overtime rate per hour for this job"
								component={ CustomInput } />
						</fieldset>

						{ alert }

						<button type="submit" className="btn btn-primary">Add Timeslot</button>
					</form>
				</div>
			</div>
		)
	}
};

function MapStateToProps(state) {
	return {
		message: state.admin.message,
		err: state.admin.err
	}
}

export default compose(
	connect(MapStateToProps, adminActions),
	reduxForm({ form: "addTimeslot" })
)(AddTimeslot);