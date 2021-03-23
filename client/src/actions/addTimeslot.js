import axios from "axios";

import { ADD_TIMESLOT_ERROR, ADD_TIMESLOT, UI_CHANGE } from "./types";

export const addTimeslot = (data) => {
	return async (dispatch) => {
		try {
			const startTime = data.Start_DateTime.toISOString().slice(0, 19).replace("T", " ");
			const endTime = data.End_DateTime.toISOString().slice(0, 19).replace("T", " ");
			const startHour = parseInt(startTime.slice(11,13)) + 8;
			const endHour = parseInt(endTime.slice(11,13)) + 8;
			const convertedStartTime = startTime.slice(0,11) + startHour.toString() + startTime.slice(13);
			const convertedEndTime = endTime.slice(0,11) + endHour.toString() + endTime.slice(13);
			data.Start_DateTime = convertedStartTime;
			data.End_DateTime = convertedEndTime;
			await axios.post("http://localhost:1337/database/timeslot", data);
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