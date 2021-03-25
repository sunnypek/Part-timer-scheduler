import React, { Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import Swal from "sweetalert2";
import "react-big-calendar/lib/css/react-big-calendar.css";

import * as timeSlotActions from "../actions/addTimeslot";
import AddTimeslotInput from "./addTimeslotInput";
import AddTimeslotReadonlyInput from "./addTimeslotReadonlyInput";
import DatePicker from "./datePicker";

const local = momentLocalizer(moment);
let eventsList = [{}];
let employeeList = [];

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {gotData: false};
		this.onTimeslotSubmit = this.onTimeslotSubmit.bind(this);
		this.onUserSubmit = this.onUserSubmit.bind(this);
	}
	
	async onTimeslotSubmit(addData) {
		await this.props.addTimeslot(addData);
		if (!this.props.err) {
			window.location.reload();
		}
	}

	async onUserSubmit(addUserData) {
		console.log(addUserData);
		await this.props.signUp(addUserData);
	}

	async componentDidMount() {
		this.props.initialize({ Create_By: localStorage.getItem("USERNAME") });
		const result = await axios.get("http://localhost:1337/database/timeslot");
		const employeeResult = await axios.get("http://localhost:1337/database/getemployees");
		for (let i = 0; i < employeeResult.data.results.length; i++) {
			employeeList.push(employeeResult.data.results[i].Employee_Name);
		};
		eventsList = result.data;
		this.setState({ gotData: true });
	}

	async selectEvent(event) {
		let formatStartTime, formatEndTime;
		if (parseInt(event.start.slice(11,13)) > 12) {
			const newStartHour = event.start.slice(11,13) - 12;
			formatStartTime = event.start.slice(0,11) + newStartHour.toString() + event.start.slice(13, 16) + " PM";
		} else {
			formatStartTime = event.start.slice(0,16) + " AM";
		}
		if (parseInt(event.end.slice(11,13)) > 12) {
			const newEndHour = event.end.slice(11,13) - 12;
			formatEndTime = event.end.slice(0, 11) + newEndHour.toString() + event.end.slice(13, 16) + " PM";
		} else {
			formatEndTime = event.end.slice(0, 16) + " AM";
		}
		Swal.fire({
            title: event.title,
            html: `
                Time: <span style="color: #e67e22">${formatStartTime}</span> to <span style="color: #e74c3c">${formatEndTime}</span><br/>
                Normal Rate: <strong style="color: #16a085">$${event.normalRate}</strong><br/>
                Overtime Rate: <strong style="color: #f39c12">$${event.overtimeRate}</strong>`,
            showDenyButton: true,
			showCancelButton: true,
            confirmButtonText: `Edit`,
            denyButtonText: `Delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
					title: "Edit timeslot",
					html: `
						<div class="row">
							<div class="col-6">
								<label class="col-form-label font-weight-bold">Start D/T</label>
								<input id="editEventStart"  value="${event.start}" class = "form-control" />
							</div>
							<div class="col-6">
								<label class="col-form-label font-weight-bold">End D/T</label>
								<input id="editEventEnd"  value="${event.end}" class = "form-control" />
							</div>
						</div>
						<div class="row">
							<div class="col-6">
								<label class="col-form-label font-weight-bold">Normal Rate</label>
								<input id="editEventNormalRate"  value="${event.normalRate}" class = "form-control" />
							</div>
							<div class="col-6">
								<label class="col-form-label font-weight-bold">OT Rate</label>
								<input id="editEventOTRate"  value="${event.overtimeRate}" class = "form-control" />
							</div>
						</div>`,
						showCancelButton: true,
						confirmButtonText: `Confirm Edit`
				}).then(async (result) => {
					if (result.isConfirmed) {
						const updateData = {
							TimeSlot_ID: event.title,
							Start_DateTime: document.getElementById("editEventStart").value,
							End_DateTime: document.getElementById("editEventEnd").value,
							Normal_Rate: document.getElementById("editEventNormalRate").value,
							OT_Rate: document.getElementById("editEventOTRate").value
						}
						await axios.patch("http://localhost:1337/database/timeslot", updateData);
						window.location.reload();
					}
				});
            } 
			if (result.isDenied) {
				Swal.fire({
					icon: "warning",
					text: "Are you sure?",
					confirmButtonText: "No",
					showDenyButton: true,
					denyButtonText: "Yes"
				}).then(async (result) => {
					if (result.isDenied) {
						await axios.delete(`http://localhost:1337/database/timeslot?timeslotID=${event.title}`);
						window.location.reload();
					}
				});
			}
        });
	}

	async adminPayroll() {
		const employeeName = document.getElementById("empNamePayroll").value;
		const period = document.getElementById("periodPayroll").value;
		const year = document.getElementById("yearPayroll").value;
		const result = await axios.get(`http://localhost:1337/database/payroll?employeeName=${employeeName}&period=${period}&year=${year}`);
		document.getElementById("hoursPayroll").value = result.data.norm;
		document.getElementById("OTPayroll").value = result.data.OT;
	}

	async adminPayslip() {

	}

	render() {
		const { handleSubmit } = this.props;

		let alert = "";
		if (this.props.err) {
			switch (this.props.message) {
				case "ADD_TIMESLOT_ERROR":
					alert = <div className="alert alert-danger text-center d-flex justify-content-center" role="alert">Please check that all data are entered correctly! (make sure ID is not in use)</div>;
					break;
				default:
					break;
			}
		}
		let empNameOptions = [];
		for (const [index, value] of employeeList.entries()) {
			empNameOptions.push(<option key={index}>{value}</option>)
		};

		let addReleaseUI = "";
		if (this.props.message === "CLICK_TIME_SLOT" || this.props.message === "ADD_TIMESLOT_ERROR") {
			addReleaseUI = 
				<form id="addTimeslotForm" className="needs-validation" onSubmit= { handleSubmit(this.onTimeslotSubmit) }>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="TimeSlot_ID" type="text" id="timeslotID_add" label="Timeslot ID" placeholder="Enter a timeslot ID" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="Create_By" type="text" id="createdBy_add" label="Created By" component={ AddTimeslotReadonlyInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="Start_DateTime" type="text" id="startDateTime_add" label="Start D/T" placeholder="Click to select date and time" component={ DatePicker } />
						</div>
						<div className="col-6 row">
							<Field alt="req" name="End_DateTime" type="text" id="endDateTime_add" label="End D/T" placeholder="Click to select date and time" component={ DatePicker } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="Normal_Rate" type="number" id="normalRate_add" label="Normal rate" placeholder="Normal rate per hour for this job" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field alt="req" name="OT_Rate" type="number" id="overtimeRate_add" label="OT rate" placeholder="Overtime rate per hour for this job" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row"><div className="col-3"></div><div className="col-6">{alert}</div><div className="col-3"></div></div>
					<div className = "row">
							<button type = "submit" className="searchBtn">Add Timeslot</button>
							<button type = "button" className="searchBtn" onClick={this.props.cancelButton}>Cancel</button>
					</div>
				</form>
		} else if (this.props.message === "CANCEL" || this.props.message === "" || this.props.message === "SUCCESS") {
			if (this.state.gotData) {
				addReleaseUI = <Calendar popup  localizer={local} onSelectEvent={this.selectEvent} events={eventsList} startAccessor="start" endAccessor="end" style={{minHeight: 500}} views={['month']} />
			} else {
				addReleaseUI = <div className="d-flex justify-content-center">
				<div className="spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>;
			}
		}

		let adminSignupAlert;
		if (this.props.message === "SUCCESS_ADD_USER") {
			adminSignupAlert = <div className="alert alert-success" role="alert">Successfully signed up!</div>;
		} else if (this.props.message === "ADD_USER_ERROR") {
			adminSignupAlert = <div className="alert alert-danger" role="alert">User already exists!</div>;
		} else {
			adminSignupAlert = "";
		}

		return(
			<div>
					<ul className = "nav-content nav nav-pills nav-justified">
							<li className = "nav-item col-3">
									<a className = "nav-link navi" data-toggle = "pill" href = "#timeslot">
											<i className="fa fa-calendar"></i><br/>
											Add/ Release Timeslots
									</a>
							</li>
							<li className = "nav-item col-3">
									<a className = "nav-link navi" data-toggle = "pill" href = "#payroll">
											<i className="fas fa-envelope-open-text"></i><br/>
											Generate Payroll
									</a>
							</li>
							<li className = "nav-item col-3">
									<a className = "nav-link navi" data-toggle = "pill" href = "#user">
											<i className="fas fa-plus"></i><br/>
											Create New User
									</a>
							</li>
					</ul>

					<div className = "tab-content">
							<div id = "timeslot" className = "tab-pane active mb-5">
								<div className="row">
									<div className="col-10">
										{ addReleaseUI }
									</div>
									<div className="d-flex flex-column col-2 justify-content-center">
										<button type="button" onClick={this.props.clickAddTimeslot} className="btn btn-primary btn-lg my-2">Add Timeslot</button>
									</div>
								</div>
							</div>

							<div id = "payroll" className = "tab-pane">
									<div className = "row">
											<div className = "col-6">
													<form> 
															<div className = "form-group row">
																	<label htmlFor = "empNamePayroll" className = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
																	<div className = "col-8">
																			<select id = "empNamePayroll" className = "form-control">
																					<option defaultValue>Choose employee</option>
																					{empNameOptions}
																			</select>
																	</div>
															</div>

															<div className = "form-group row">
																	<label htmlFor = "periodPayroll" className = "col-4 col-form-label font-weight-bold">Period: &nbsp;</label>
																	<div className = "col">
																			<select id = "periodPayroll" className = "form-control">
																					<option defaultValue>January</option>
																					<option>February</option>
																					<option>March</option>
																					<option>April</option>
																					<option>May</option>
																					<option>June</option>
																					<option>July</option>
																					<option>August</option>
																					<option>September</option>
																					<option>October</option>
																					<option>November</option>
																					<option>December</option>
																			</select> 
																	</div> &nbsp;
																	<div className = "col">
																			<select id = "yearPayroll" className = "form-control yrControl">
																					<option defaultValue>2020</option>
																					<option>2021</option>
																					<option>2022</option>
																			</select>
																	</div>
															</div>

															<div className = "row">
																	<button type = "button" className = "searchBtn" onClick={this.adminPayroll}>Search</button>
															</div>
													</form>
											</div>

											<div className = "col-6">
													<form>
															<div className = "form-group row">
																	<label htmlFor = "hoursPayroll" className = "col-4 col-form-label font-weight-bold">Total Hours: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "hoursPayroll" type = "text" className = "form-control" readOnly></input>
																	</div>
															</div>
															<div className = "form-group row">
																	<label htmlFor = "OTPayroll" className = "col-4 col-form-label font-weight-bold">Total OT: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "OTPayroll" type = "text" className = "form-control" readOnly></input>
																	</div>
															</div>
															<div className = "row">
																	<button type = "button" className = "payslipBtn" onClick={this.adminPayslip}>Generate Payslip</button>
															</div>
															
													</form>
											</div>
									</div>
							</div>

							<div id = "user" className = "tab-pane">
									<div className = "row">
											<div className = "col-3"></div>
											<div className = "col-6">
												<form id="addUserForm" className="needs-validation" onSubmit={ handleSubmit(this.onUserSubmit) }>
													<div className="row">
														<Field alt="req" name="username" type="text" id="username_add" label="Name" placeholder="Enter a username for user" component={ AddTimeslotInput } />
													</div>
													<div className="row">
														<Field alt="req" name="email" type="email" id="email_add" label="Email" placeholder="Enter an email for user" component={ AddTimeslotInput } />
													</div>
													<div className="row">
														<Field alt="req" name="password" type="text" id="password_add" label="Password" placeholder="Enter a password for user" component={ AddTimeslotInput } />
													</div>
													<div className="row"><div className="col-3"></div><div className="col-6">{ adminSignupAlert }</div><div className="col-3"></div></div>
													<div className = "row">
														<button type = "submit" className="searchBtn">Add User</button>
													</div>
												</form>
											</div>
									</div>
							</div>
					</div>
			</div>
		)
	}
};

function MapStateToProps(state) {
	return {
		message: state.admin.message,
		err: state.admin.err,
		gotData: state.admin.gotData
	}
}

export default compose(
	connect(MapStateToProps, timeSlotActions),
	reduxForm({ form: "admin" })
)(Admin);
