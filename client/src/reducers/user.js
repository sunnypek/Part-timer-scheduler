import { USER_CLOCK_IN, USER_CLOCK_ERROR } from "../actions/types";

const DEFAULT_STATE = {
	message: ""
}

const userReducer = (state = DEFAULT_STATE, action) => {
	switch(action.type) {
		case USER_CLOCK_IN:
			return { ...state, message: "CLOCK IN"};
        case USER_CLOCK_ERROR:
            return { ...state, message: "ALREADY CLOCKED IN"}
		default:
			return state;
	}
}

export default userReducer;
