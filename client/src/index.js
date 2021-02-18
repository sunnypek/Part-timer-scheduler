import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";

import reportWebVitals from './reportWebVitals';
import App from "./Components/App";
import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import Admin from "./Components/admin";
import reducers from "./reducers";

const jwtToken = localStorage.getItem("JWT_TOKEN");
//const authLevel = localStorage.getItem("AUTH_LEVEL");

ReactDOM.render(
	<Provider store={ createStore(reducers, {
		auth: {
			token: jwtToken,
			isAuthenticated: jwtToken ? true : false
		}
	}, applyMiddleware(reduxThunk)) }>
		<BrowserRouter>
			<App>
				<Route exact path="/home" component={Home} />
				<Route exact path="/" component={Signup} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/logout" component={Logout} />
				<Route exact path="/admin" component={Admin} />
			</App>
		</BrowserRouter>
	</Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
