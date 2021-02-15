import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
	};

	logout() {
		this.props.logout();
	};

	render() {
		let loginSystem;
		if (this.props.isAuthenticated) {
			if (this.props.authLevel === "admin") {
				loginSystem = [	<ul className="navbar-nav me-auto" key="homeNav">
													<li className="nav-item">
														<Link className="nav-link" to="/home">Home</Link>
													</li>
													<li className="nav-item">
														<Link className="nav-link" to="#">Admin</Link>
													</li>
												</ul>,
												<ul className="nav navbar-nav ms-auto" key="logoutNav">
													<li className="nav-item">
														<Link className="nav-link" to="/logout" onClick={this.logout}>Logout</Link>
													</li>
												</ul>]
			} else {
				loginSystem = [	<ul className="navbar-nav me-auto" key="homeNav">
													<li className="nav-item">
														<Link className="nav-link" to="/home">Home</Link>
													</li>
													<li className="nav-item">
														<Link className="nav-link" to="#">User</Link>
													</li>
												</ul>,
												<ul className="nav navbar-nav ms-auto" key="logoutNav">
													<li className="nav-item">
														<Link className="nav-link" to="/logout" onClick={this.logout}>Logout</Link>
													</li>
												</ul>]
			}
		} else {
			loginSystem = <ul className="nav navbar-nav ms-auto">
											<li className="nav-item">
												<Link className="nav-link" to="/">Sign Up</Link>
											</li>
											<li className="nav-item">
												<Link className="nav-link" to="/login">Login</Link>
											</li>
										</ul>
		}

		return (
			<nav className="navbar navbar-expand navbar-dark bg-dark px-5">
				<Link className="navbar-brand" to="#">Uni Blue</Link>

				<div className="collapse navbar-collapse">
					

					{ loginSystem }
				</div>
			</nav>
		);
	}
};

function MapStateToProps(state) {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		authLevel: state.auth.authLevel
	}
}

export default connect(MapStateToProps, actions)(Navbar);