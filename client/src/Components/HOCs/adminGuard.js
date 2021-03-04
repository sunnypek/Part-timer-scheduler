import React, { Component } from "react";
import { connect } from "react-redux";

const adminGuard = (OriginalComponent) => {
	class MixedComponent extends Component {
		
		checkAuth() {
			if (this.props.authLevel !== "admin") {
				this.props.history.push("/home");
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
			authLevel: state.auth.authLevel
		}
	}

	return connect(MapStateToProps)(MixedComponent);
}

export default adminGuard;
