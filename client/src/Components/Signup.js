import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";

import * as actions from "../actions";
import CustomInput from "./CustomInput";

class Signup extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	
	async onSubmit(formData) {
		await this.props.signUp(formData);
	}
	
	render() {
		const { handleSubmit } = this.props;
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

						<button type="submit" className="btn btn-primary">Sign Up</button>
					</form>
				</div>
			</div>
		)
	}
};

export default compose(
	connect(null, actions),
	reduxForm({ form: "signup" })
)(Signup);