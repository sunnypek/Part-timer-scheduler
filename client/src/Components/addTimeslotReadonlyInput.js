import React, { Component } from "react";

export default class AddTimeslotReadonlyInput extends Component {
	render() {
		const { input: { value, onChange }} = this.props;
		return(
				<React.Fragment>
					<div className="col-3">
						<label className="col-form-label font-weight-bold" htmlFor={this.props.id}>{this.props.label}:</label>
					</div>
					<div className="col-9">
                    <input 
                        name = { this.props.name }
                        id = { this.props.id }
                        className = "form-control"
                        type = { this.props.type }
                        value = { value }
                        onChange = { onChange }
                        readOnly />
					</div>
				</React.Fragment>
		);
	}
}