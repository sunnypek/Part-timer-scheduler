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
		if (!this.props.err) {
			this.props.history.push("/");
		}
	}
	
	render() {
		const { handleSubmit } = this.props;

		let alert;
		if (this.props.err) {
			switch (this.props.message) {
				case "SIGN_UP_NO_EMAIL":
					alert = <div className="alert alert-danger">Email is missing!</div>;
					break;
				case "SIGN_UP_PASSWORD_LENGTH_ERROR":
					alert = <div className="alert alert-danger">Password must be min 6 and max 18!</div>;
					break;
				case "SIGN_UP_NO_PASSWORD_ERROR":
					alert = <div className="alert alert-danger">Password is missing!</div>;
					break;
				case "SIGN_UP_NO_DETAILS":
					alert = <div className="alert alert-info">Please enter your details.</div>;
					break;
				default:
					alert = <div className="alert alert-danger">Email is already in use!</div>;
					break;
			}
		} else {
			if (this.props.message === "SIGN_UP") {
				alert = <div className="alert alert-success">Successfully signed up!</div>;
			} else {
				alert = "";
			}
		}

		return(
			<div className="row justify-content-center">
				<div className="col-4">
					<div className="alert alert-primary text-center">
						Sign Up
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
		message: state.auth.message,
		err: state.auth.err
	}
}

export default compose(
	connect(MapStateToProps, actions),
	reduxForm({ form: "signup" })
)(SignUp);