import { ADD_TIMESLOT, ADD_TIMESLOT_ERROR, UI_CHANGE } from "../actions/types";

const DEFAULT_STATE = {
	message: "",
	err: false
}

const adminReducer = (state = DEFAULT_STATE, action) => {
	switch(action.type) {
		case ADD_TIMESLOT:
			return { message: action.payload, err: false };
		case ADD_TIMESLOT_ERROR:
			return { message: action.payload, err: true };
		case UI_CHANGE:
			return { message: action.payload, err: false };
		default:
			return state;
	}
}

export default adminReducer;