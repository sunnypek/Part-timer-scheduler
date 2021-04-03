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

const column = {
    padding: "5px",
    width: "50%",
    float: "left"
};
const td = {
    textalign: "left",
    padding: "16px"
};
const th = {
    textalign: "left",
    padding: "10px",
    backgroundColor: "#f9e79f",
    width: "1000px"
};
const th2 = {
    textalign: "right",
    padding: "10px",
    backgroundColor: "#f9e79f"
};
const th3 = {
    textalign: "right",
    padding: "10px",
};
const divformat = {
    display: "flex"
};
const fomatleft = {
    marginLeft: "auto"
};

const local = momentLocalizer(moment);
let eventsList = [{}];
let employeeList = [];
let hoursWorked = 0, hoursOT = 0, OTtotal = 0, NormTotal = 0
let totalTime = 0, salary = 0, OTSalary = 0, totalsalary = 0, employeeCPF = 0, employerCPF = 0, cdac = (0).toFixed(2), finalSalary = 0;

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
		const result = await axios.get(`http://localhost:1337/database/book?timeslotID=${event.title}`);
        let registeredUsers = "";
        if (result.data.length > 0) {
			registeredUsers += "<ol style='padding-left: 1rem;'>";
            for (let i = 0; i < result.data.length; i++) {
                registeredUsers += `<li>${result.data[i].Employee_Name}</li>`;
            };
			registeredUsers += "</ol>";
        } else {
            registeredUsers += "No one have registered yet!";
        }
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
		if (event.start.slice(11,13) === "") {
			formatStartTime = event.start.slice(0, 11) + " 12:00 AM";
		} else if (event.start.slice(11,13) === "00") {
			formatStartTime = event.start.slice(0, 11) + " 12:30 AM";
		}
		if (event.end.slice(11,13) === "") {
			formatEndTime = event.end.slice(0, 11) + " 12:00 AM";
		} else if (event.end.slice(11,13) === "00") {
			formatEndTime = event.end.slice(0, 11) + " 12:30 AM";
		}
		Swal.fire({
            title: event.title,
            html: `
				<div class="row">
					<div class="col-6" style="text-align:right;">
						<br/>
						Time:<br/><br/>
						<br/>
						Normal Rate:<br/>
						Overtime Rate:
					</div>
					<div class="col-6" style="text-align:left">
						<span style="color: #e67e22">${formatStartTime}</span><br/>
						<div style="width: 65%; text-align: center;">to</div>
						<span style="color: #e74c3c">${formatEndTime}</span><br/>
						<br/>
						<strong style="color: #16a085">$${event.normalRate}</strong><br/>
						<strong style="color: #f39c12">$${event.overtimeRate}</strong>
					</div>
				</div>
				<br/>
				<div class="row">
					<div class="col-6" style="text-align:right;">
						Part timers needed:
					</div>
					<div class="col-6" style="text-align:left">
						${event.need}
					</div>
				</div>
				<div class="row">
					<div class="col-6" style="text-align:right;">
						Registered users:
					</div>
					<div class="col-6" style="text-align:left">
						${registeredUsers}
					</div>
				</div>
			`,
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
						</div>
						<div class="row">
							<div class="col-6">
								<label class="col-form-label font-weight-bold">P/T Needed</label>
								<input id="editEventNeed"  value="${event.need}" class = "form-control" />
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
							OT_Rate: document.getElementById("editEventOTRate").value,
							need: document.getElementById("editEventNeed").value
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
		if (employeeName !== "Choose employee") {
			const period = document.getElementById("periodPayroll").value;
			const year = document.getElementById("yearPayroll").value;
			const result = await axios.get(`http://localhost:1337/database/payroll?employeeName=${employeeName}&period=${period}&year=${year}`);
			document.getElementById("hoursPayroll").value = result.data.norm;
			document.getElementById("OTPayroll").value = result.data.OT;
			
			hoursWorked = 0; hoursOT = 0; OTtotal = 0; NormTotal = 0
			totalTime = 0; salary = 0; OTSalary = 0; totalsalary = 0; employeeCPF = 0; employerCPF = 0; cdac = (0).toFixed(2); finalSalary = 0;
			const monthName = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];
			const month = monthName.indexOf(document.getElementById("periodPayroll").value);
			const data = {
				year: year,
				month: month,
				username: employeeName
			}
			const res = await axios.post("http://localhost:1337/database/payslip", data);
			for (let i = 0; i < res.data.payslipbookingDetails.length; i++) {
				hoursWorked += res.data.payslipbookingDetails[i].Normal_hr;
				hoursOT += res.data.payslipbookingDetails[i].OverTime_hr;

				for (let k = 0; k < res.data.paysliptimeslotDetails.length; k++) {
					if (res.data.payslipbookingDetails[i].Timeslot_ID === res.data.paysliptimeslotDetails[k].TimeSlot_ID) {
						if (res.data.payslipbookingDetails[i].Clock_IN != null && res.data.payslipbookingDetails[i].Clock_OUT != null) {
							OTtotal += (res.data.payslipbookingDetails[i].OverTime_hr * res.data.paysliptimeslotDetails[k].OT_Rate);
							NormTotal += (res.data.payslipbookingDetails[i].Normal_hr * res.data.paysliptimeslotDetails[k].Normal_Rate);
						}
					}
				}
			}
			totalTime = hoursWorked + hoursOT;
			if (totalTime < 10) totalTime = '0'+ totalTime;
			salary = NormTotal;
			OTSalary = OTtotal;
			totalsalary = (salary + OTSalary);
			employeeCPF = (0.20 * totalsalary);
			employerCPF = (0.17 * totalsalary);

			if (totalsalary !== 0) {
				if (totalsalary <= 2000){
					cdac = 0.50.toFixed(2);
				}
				else if (totalsalary > 2000){
					cdac = 1.00.toFixed(2);
				}
				else if (totalsalary > 3500){
					cdac = 1.50.toFixed(2);
				}
				else if (totalsalary > 5000){
					cdac = 2.00.toFixed(2);
				}
				else if (totalsalary > 7500){
					cdac = 3.00.toFixed(2);
				}
			}

			finalSalary = (totalsalary - employeeCPF - cdac).toFixed(2);
			totalsalary = totalsalary.toFixed(2);
			employeeCPF = employeeCPF.toFixed(2);
			employerCPF = employerCPF.toFixed(2);
			salary = salary.toFixed(2);
			OTSalary = OTSalary.toFixed(2);
			document.getElementById("totalTime").innerHTML = totalTime;
			document.getElementById("salary").innerHTML = "$" + salary;
			document.getElementById("OTSalary").innerHTML = "$" + OTSalary;
			document.getElementById("totalsalary").innerHTML = "$" + totalsalary;
			document.getElementById("cdac").innerHTML = "$" + cdac;
			document.getElementById("cdac2").innerHTML = "$" + cdac;
			document.getElementById("employerCPF").innerHTML = "$" + employerCPF;
			document.getElementById("employeeCPF").innerHTML = "$" + employeeCPF;
			document.getElementById("finalSalary").innerHTML = "$" + finalSalary;
			document.getElementById("totalsalary2").innerHTML = "$" + totalsalary;
		} else {
			Swal.fire({ icon: "error", title: "Please choose a part timer!"});
		};
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
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="need" type="number" id="need" label="P/T needed" placeholder="How many part timers do you need" component={ AddTimeslotInput } />
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
																	<label htmlFor = "hoursPayroll" className = "col-4 col-form-label font-weight-bold">Normal Hours: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "hoursPayroll" type = "text" className = "form-control" readOnly></input>
																	</div>
															</div>
															<div className = "form-group row">
																	<label htmlFor = "OTPayroll" className = "col-4 col-form-label font-weight-bold">OT Hours: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "OTPayroll" type = "text" className = "form-control" readOnly></input>
																	</div>
															</div>
													</form>
											</div>
											<div className="row mt-3">
												<div>
													<div style={divformat}>
														<p style={fomatleft}>Hours Worked (Per Month): <span id="totalTime">{totalTime}</span> hours (Include OT)</p>
													</div>
													
													<div className="row">
														<div style={column}>
															<table>
																<tr>
																	<th style={th}>Payments</th>
																	<th style={th2}>SGD$</th>
																</tr>
																<tr>
																	<td style={td}>Salary</td>
																	<th style={th3} id="salary">${salary}</th>
																</tr>
																<tr>
																	<td style={td}>Overtime</td>
																	<th style={th3} id="OTSalary">${OTSalary}</th>
																</tr>
																<tr>
																	<td style={td}>Total</td>
																	<th style={th3} id="totalsalary">${totalsalary}</th>
																</tr>
															</table>
														</div>
													
														<div style={column}>
															<table>
																<tr>
																	<th style={th}>Deductions</th>
																	<th style={th2}>SGD$</th>
																</tr>
																<tr>
																	<td style={td}>CDAC</td>
																	<th style={th3} id="cdac">${cdac}</th>
																</tr>
																<tr>
																	<td style={td}>Total</td>
																	<th style={th3} id="cdac2">${cdac}</th>
																</tr>
															</table>
														</div>
														<div style={column}>
															<table>
																<tr>
																	<th style={th}>CPF Constributions</th>
																	<th style={th2}>SGD$</th>
																</tr>
																<tr>
																	<td style={td}>Employer's CPF</td>
																	<th style={th3} id="employerCPF">${employerCPF}</th>
																</tr>
																<tr>
																	<td style={td}>Employee's CPF</td>
																	<th style={th3} id="employeeCPF">${employeeCPF}</th>
																</tr>
															</table>
														</div>
														<div style={column}>
															<table>
																<tr>
																	<th style={th}>Earnings</th>
																	<th style={th2}>SGD$</th>
																</tr>
																<tr>
																	<td style={td}>Nett Salary</td>
																	<th style={th3} id="finalSalary">${finalSalary}</th>
																</tr>
																<tr>
																	<td style={td}>Gross Salary</td>
																	<th style={th3} id="totalsalary2">${totalsalary}</th>
																</tr>
															</table>
														</div>
													</div>                
												</div>
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
