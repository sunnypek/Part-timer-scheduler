import { AUTH_SIGN_UP, AUTH_ERROR, AUTH_LOGOUT, AUTH_LOGIN } from "../actions/types";

const DEFAULT_STATE = {
	isAuthenticated: false,
	token: "",
	message: "",
	err: false
}

const authReducer = (state = DEFAULT_STATE, action) => {
	switch(action.type) {
		case AUTH_LOGIN:
			return { ...state, token: action.payload, isAuthenticated: true, message: "LOGIN", err: false};
		case AUTH_SIGN_UP:
			return { ...state, token: action.payload, isAuthenticated: true, message: "SIGN_UP", err: false };
		case AUTH_LOGOUT:
			return { ...state, token: action.payload, isAuthenticated: false, message: "LOGOUT", err: false};
		case AUTH_ERROR:
			return { ...state, err: true, message: action.payload };
		default:
			return state;
	}
}

export default authReducer;