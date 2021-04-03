import axios from "axios";

import { ADD_TIMESLOT_ERROR, ADD_TIMESLOT, UI_CHANGE } from "./types";

export const addTimeslot = (data) => {
	return async (dispatch) => {
		try {
			const startTime = data.Start_DateTime.toISOString().slice(0, 19).replace("T", " ");
			const endTime = data.End_DateTime.toISOString().slice(0, 19).replace("T", " ");
			let startHour = parseInt(startTime.slice(11,13));
			let endHour = parseInt(endTime.slice(11,13));
			let convertedStartTime, convertedEndTime;
			if (startHour >= 16) {
				let startDate = parseInt(startTime.slice(8,10)) + 1;
				convertedStartTime = startTime.slice(0,8) + startDate.toString() + " ";
			};
			if (endHour >= 16) {
				let endDate = parseInt(endTime.slice(8,10)) + 1;
				convertedEndTime = endTime.slice(0,8) + endDate.toString() + " ";
			};
			startHour = startHour + 8;
			endHour = endHour + 8;
			if (startHour === 24) {
				startHour = 0;
			};
			if (endHour ===24) {
				endHour = 0;
			};
			convertedStartTime = convertedStartTime + startHour.toString() + startTime.slice(13);
			convertedEndTime = convertedEndTime + endHour.toString() + endTime.slice(13);
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
};

export const cancelButton = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CANCEL"});
};

export const signUp = (data) => {
	return async (dispatch) => {
		try {
			delete data.Create_By;
			data.authLevel = "user";
			console.log(data);
			await axios.post("http://localhost:1337/users/signup", data);
			dispatch({
				type: ADD_TIMESLOT,
				payload: "SUCCESS_ADD_USER"
			});
		} catch (error) {
			dispatch({
				type: ADD_TIMESLOT_ERROR,
				payload: "ADD_USER_ERROR"
			});
		}
	}
};