import axios from "axios";

import { ADD_TIMESLOT_ERROR, ADD_TIMESLOT, UI_CHANGE } from "./types";

export const addTimeslot = (data) => {
	return async (dispatch) => {
		try {
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

export const editTimeslot = (data) => {
	return async (dispatch) => {
		try {
			await axios.patch("http://localhost:1337/database/timeslot", data);
			dispatch({
				type: ADD_TIMESLOT,
				payload: "SUCCESS"
			});
		} catch (error) {
			dispatch({
				type: ADD_TIMESLOT_ERROR,
				payload: "PATCH_TIMESLOT_ERROR"
			});
		}
	}
};

export const deleteTimeslot = (data) => {
	return async (dispatch) => {
		try {
			await axios.delete("http://localhost:1337/database/timeslot", {data});
			dispatch({
				type: ADD_TIMESLOT,
				payload: "SUCCESS"
			});
		} catch (error) {
			dispatch({
				type: ADD_TIMESLOT_ERROR,
				payload: "DELETE_TIMESLOT_ERROR"
			});
		}
	}
}

export const clickAddTimeslot = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CLICK_TIME_SLOT"});
}

export const clickEditTimeslot = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CLICK_TIME_SLOT_EDIT"});
}

export const clickDeleteTimeslot = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CLICK_TIME_SLOT_DELETE"});
}

export const cancelButton = () => {
	return (dispatch) => dispatch({ type: UI_CHANGE, payload: "CANCEL"});
}