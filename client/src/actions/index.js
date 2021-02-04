import axios from "axios";

import { AUTH_ERROR, AUTH_SIGN_UP, AUTH_LOGOUT } from "./types";

export const signUp = (data) => {
	/** 
	 * 1. use data to make HTTP request to backend 
	 * 2. take backend response (JWT)
	 * 3. dispatch user signed up with JWT
	 * 4. save JWT to local storage 
	*/
	return async (dispatch) => {
		try {
				if (data.authLevel) {
					data.authLevel = "admin";
				} else {
					data.authLevel = "user";
				}
				const res = await axios.post("http://localhost:1337/users/signup", data);
				dispatch({
					type: AUTH_SIGN_UP,
					payload: res.data.token
				});

				localStorage.setItem("JWT_TOKEN", res.data.token);
		} catch (error) {
			if (Object.keys(data).length === 2 && data.constructor === Object) {
				if (!data.hasOwnProperty("email")) {
					dispatch({
						type: AUTH_ERROR,
						payload: "SIGN_UP_NO_EMAIL"
					});
				} else {
					dispatch({
						type: AUTH_ERROR,
						payload: "SIGN_UP_NO_PASSWORD_ERROR"
					});
				}
			} else if (Object.keys(data).length !== 3 && data.constructor === Object) {
				dispatch({
					type: AUTH_ERROR,
					payload: "SIGN_UP_NO_DETAILS"
				});
			} else {
				if (data.password.length < 6 || data.password.length > 18) {
					dispatch({
						type: AUTH_ERROR,
						payload: "SIGN_UP_PASSWORD_LENGTH_ERROR"
					});
				} else {
					dispatch({
						type: AUTH_ERROR,
						payload: "SIGN_UP_ERROR"
					});
				}
			}
		}
	}
};

export const logout = () => {
	return (dispatch) => {
		localStorage.removeItem("JWT_TOKEN");

		dispatch({
			type: AUTH_LOGOUT,
			payload: ""
		});
	};
};