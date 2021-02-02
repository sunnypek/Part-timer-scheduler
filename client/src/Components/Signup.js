import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";

import * as actions from "../actions";
import CustomInput from "./CustomInput";
import CustomCheckbox from "./CustomCheckbox";

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	async onSubmit(formData) {
		await this.props.signUp(formData);
	}
	
	render() {
		const { handleSubmit } = this.props;

		let alert;
		if (this.props.message === "SIGN_UP_ERROR") {
			alert = <div className="alert alert-danger">Email is already in use!<br/>Or<br/>Password is too short!<br/>(min: 6, max: 18)</div>
		} else if (this.props.message === "SIGN_UP") {
			alert = <div className="alert alert-success">Successfully signed up!</div>
		} else if (this.props.message === "SIGN_UP_NO_DETAILS") {
			alert = <div className="alert alert-info">Please enter your details.</div>
		} else {
			alert = "";
		};

		return(
			<div className="row justify-content-center">
				<div className="col-4">
					<div className="alert alert-primary text-center">
						Sign up form
					</div>
					<form onSubmit={ handleSubmit(this.onSubmit) }>
						<fieldset>
							<Field
								name="email"
								type="text"
								id="email"
								label="Email"
								placeholder="example@example.com"
								component= { CustomInput } />
						</fieldset>
						<fieldset>
							<Field
								name="password"
								type="password"
								id="password"
								label="Password"
								placeholder=""
								component= { CustomInput } />
						</fieldset>
						<fieldset>
							<div>
								<Field 
									name="authLevel" 
									id="authLevel" 
									type="checkbox"
									label="Admin"
									placeholder=""
									component={ CustomCheckbox } />
							</div>
						</fieldset>

						{ alert }

						<button type="submit" className="btn btn-primary">Sign Up</button>
					</form>
				</div>
			</div>
		)
	}
};

function MapStateToProps(state) {
	return {
		message: state.auth.message
	}
}

export default compose(
	connect(MapStateToProps, actions),
	reduxForm({ form: "signup" })
)(SignUp);