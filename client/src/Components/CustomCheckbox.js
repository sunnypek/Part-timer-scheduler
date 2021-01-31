import React, { Component } from "react";

export default class CustomCheckbox extends Component {
	render() {
		const { input: { value, onChange }} = this.props;
		return(
			<div className="form-check mb-3">
				<label className="form-check-label" htmlFor={ this.props.id }>{ this.props.label }</label>
				<input 
					name = { this.props.name }
					id = { this.props.id }
					placeholder = { this.props.placeholder }
					className = "form-check-input"
					type = { this.props.type }
					value = { value }
					onChange = { onChange }
				/>
			</div>
		);
	}
}