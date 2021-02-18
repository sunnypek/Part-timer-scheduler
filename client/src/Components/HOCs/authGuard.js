import React, { Component } from "react";
import { connect } from "react-redux";

const authGuard = (OriginalComponent) => {
	class MixedComponent extends Component {
		
		checkAuth() {
			if (!this.props.isAuthenticated && !this.props.token) {
				this.props.history.push("/");
			}
		}

		componentDidMount() {
			this.checkAuth();
		}

		componentDidUpdate() {
			this.checkAuth();
		}
		
		render() {
			return <OriginalComponent { ...this.props } />;
		}	
	}

	function MapStateToProps(state) {
		return {
			isAuthenticated: state.auth.isAuthenticated,
			token: state.auth.token
		}
	}

	return connect(MapStateToProps)(MixedComponent);
}

export default authGuard;
