import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";

import * as actions from "../actions";
import CustomInput from "./CustomInput";

class Login extends Component {
	constructor(props) {
		super(props);
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
	}

	async onLoginSubmit(formData) {
		await this.props.login(formData);
		if (!this.props.err) {
			this.props.history.push("/home");
		}
	}
	
	render() {
		const { handleSubmit } = this.props;

		let alert;
		if (this.props.err) {
			switch (this.props.message) {
				case "SIGN_UP_NO_EMAIL":
					alert = <div className="alert alert-danger" role="alert">Email is missing!</div>;
					break;
				case "SIGN_UP_PASSWORD_LENGTH_ERROR":
					alert = <div className="alert alert-danger" role="alert">Password must be min 6 and max 18!</div>;
					break;
				case "SIGN_UP_NO_PASSWORD_ERROR":
					alert = <div className="alert alert-danger" role="alert">Password is missing!</div>;
					break;
				case "SIGN_UP_NO_DETAILS":
					alert = <div className="alert alert-info" role="alert">Please enter your details.</div>;
					break;
				default:
					alert = <div className="alert alert-danger" role="alert">No account found / Password is wrong!</div>;
					break;
			}
		} else {
			if (this.props.message === "SIGN_UP") {
				alert = <div className="alert alert-success" role="alert">Successfully signed up!</div>;
			} else {
				alert = "";
			}
		}

		return(
			<div className="row justify-content-center">
				<div className="col-4">
					<div className="alert alert-success text-center" role="alert">
						Login
					</div>
					<form onSubmit={ handleSubmit(this.onLoginSubmit) }>
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

						{ alert }

						<button type="submit" className="btn btn-primary">Login</button>
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
	reduxForm({ form: "login" })
)(Login);