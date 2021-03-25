import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";

import reportWebVitals from './reportWebVitals';
import App from "./Components/App";
import ClockIn from "./Components/ClockIn";
import ClockOut from "./Components/ClockOut";
import PaySlip from "./Components/PaySlip";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import Summary from "./Components/Summary"
import Admin from "./Components/admin";
import RegisterSlots from "./Components/registerSlots";
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
				<Route exact path="/calendar" component={authGuard(RegisterSlots)} />
				<Route exact path="/" component={Login} />
				<Route exact path="/summary" component={authGuard(Summary)} />
				<Route exact path="/payslip" component={authGuard(PaySlip)} />
				<Route exact path="/logout" component={authGuard(Logout)} />
				<Route exact path="/admin" component={adminGuard(authGuard(Admin))} />
			</App>
		</BrowserRouter>
	</Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
