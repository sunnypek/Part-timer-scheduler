import axios from "axios";

import { ADD_TIMESLOT_ERROR, ADD_TIMESLOT, UI_CHANGE } from "./types";

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
				payload: "ADD_TIMESLOT_ERROR"
			});
		}
	}
};

export const clickAddTimeslot = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CLICK_TIME_SLOT"});
}

export const cancelButton = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CANCEL"});
}