import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";

import CustomInput from "./CustomInput";

class Signup extends Component {
	onSubmit(formData) {
		console.log("submit button");
		console.log(formData);
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

export default reduxForm({ form: "signup" })(Signup);