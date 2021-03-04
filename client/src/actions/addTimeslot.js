import axios from "axios";

import { ADD_TIMESLOT_ERROR, ADD_TIMESLOT } from "./types";

export const addTimeslot = (data) => {
	return async (dispatch) => {
		try {
			console.log("data is ", data);
			const res = await axios.post("http://localhost:1337/database/addTimeslot", data);
			console.log(res);
			dispatch({
				type: ADD_TIMESLOT,
				payload: "SUCCESS"
			});
		} catch (error) {
			dispatch({
				type: ADD_TIMESLOT_ERROR,
				payload: "ERROR"
			});
		}
	}
}