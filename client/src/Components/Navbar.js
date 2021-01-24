import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand navbar-dark bg-dark px-5">
				<Link className="navbar-brand" to="/">Uni Blue</Link>

				<div className="collapse navbar-collapse">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/">Home</Link>
						</li>
					</ul>

					<ul className="nav navbar-nav ms-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/signup">Sign Up</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/login">Login</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/logout">Logout</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}