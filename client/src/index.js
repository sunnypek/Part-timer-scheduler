import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";

import reportWebVitals from './reportWebVitals';
import App from "./Components/App";
import Home from "./Components/Home";
import ClockIn from "./Components/ClockIn";
import ClockOut from "./Components/ClockOut";
import Attendance from "./Components/Attendance";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import Summary from "./Components/Summary"
import Admin from "./Components/admin";
import AddTimeslot from "./Components/AddTimeslot";
import reducers from "./reducers";
import authGuard from "./Components/HOCs/authGuard";
import adminGuard from "./Components/HOCs/adminGuard";

const jwtToken = localStorage.getItem("JWT_TOKEN");
const authLevel = localStorage.getItem("AUTH_LEVEL");

ReactDOM.render(
	<Provider store={ createStore(reducers, {
		auth: {
			token: jwtToken,
			isAuthenticated: jwtToken ? true : false,
			authLevel: authLevel
		}
	}, applyMiddleware(reduxThunk)) }>
		<BrowserRouter>
			<App>
        <Route exact path="/clockIn" component={authGuard(ClockIn)} />
		<Route exact path="/clockOut" component={authGuard(ClockOut)} />
        <Route exact path="/home" component={authGuard(Home)} />
				<Route exact path="/" component={Signup} />
				<Route exact path="/login" component={Login} />
        <Route exact path="/summary" component={authGuard(Summary)} />
        <Route exact path="/logout" component={authGuard(Logout)} />
				<Route exact path="/admin" component={adminGuard(authGuard(Admin))} />
				<Route exact path="/admin/addTimeslot" component={adminGuard(authGuard(AddTimeslot))} />
				<Route exact path="/attendance" component={authGuard(Attendance)} />
			</App>
		</BrowserRouter>
	</Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
