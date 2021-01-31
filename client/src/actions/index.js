import axios from "axios";

import { AUTH_ERROR, AUTH_SIGN_UP } from "./types";

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
			dispatch({
				type: AUTH_ERROR,
				payload: "Email is already in use"
			})
		}
	}
};