import React, { Component } from "react";

export default class AddTimeslotInput extends Component {
	render() {
		const { input: { value, onChange }} = this.props;
		let field = "";
		if (this.props.alt === "req") {
			field = <input 
			name = { this.props.name }
			id = { this.props.id }
			placeholder = { this.props.placeholder }
			className = "form-control"
			type = { this.props.type }
			min={this.props.min}
			step ={this.props.step}
			value = { value }
			onChange = { onChange }
			required />
		} else {
			field = <input 
			name = { this.props.name }
			id = { this.props.id }
			placeholder = { this.props.placeholder }
			className = "form-control"
			type = { this.props.type }
			value = { value }
			onChange = { onChange } />
		}
		return(
				<React.Fragment>
					<div className="col-3">
						<label className="col-form-label font-weight-bold" htmlFor={this.props.id}>{this.props.label}:</label>
					</div>
					<div className="col-9">
						{field}
					</div>
				</React.Fragment>
		);
	}
}