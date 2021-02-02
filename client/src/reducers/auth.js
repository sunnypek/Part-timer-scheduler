import { AUTH_SIGN_UP, AUTH_ERROR } from "../actions/types";

const DEFAULT_STATE = {
	isAuthenticated: false,
	token: "",
	message: ""
}

const authReducer = (state = DEFAULT_STATE, action) => {
	switch(action.type) {
		case AUTH_SIGN_UP:
			return { ...state, token: action.payload, isAuthenticated: true, message: "SIGN_UP" };
		case AUTH_ERROR:
			return { ...state, message: action.payload };
		default:
			return state;
	}
}

export default authReducer;