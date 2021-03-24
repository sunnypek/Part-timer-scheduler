import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./auth";
import adminReducer from "./admin";
import userReducer from "./user";

export default combineReducers({
	form: formReducer,
	auth: authReducer,
	admin: adminReducer,
	user: userReducer
});
