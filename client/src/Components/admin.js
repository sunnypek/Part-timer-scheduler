import React, { Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import Swal from "sweetalert2";
// eslint-disable-next-line
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';

import * as timeSlotActions from "../actions/addTimeslot";
import AddTimeslotInput from "./addTimeslotInput";

const local = momentLocalizer(moment);
let eventsList = [{}];

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {gotData: false};
		this.onTimeslotSubmit = this.onTimeslotSubmit.bind(this);
		this.onTimeslotEdit = this.onTimeslotEdit.bind(this);
		this.onTimeslotDelete = this.onTimeslotDelete.bind(this);
	}
	
	async onTimeslotSubmit(addData) {
		await this.props.addTimeslot(addData);
		if (!this.props.err) {
			window.location.reload();
		}
	}

	async onTimeslotEdit(editData) {
		await this.props.editTimeslot(editData);
		if (!this.props.err) {
			window.location.reload();
		}
	}

	async onTimeslotDelete(deleteData) {
		eventsList = await this.props.deleteTimeslot(deleteData);
		if (!this.props.err) {
			window.location.reload();
		}
	}

	async componentDidMount() {
		const result = await axios.get("http://localhost:1337/database/timeslot");
		eventsList = result.data;
		this.setState({ gotData: true });
	}

	async selectEvent(event) {
		Swal.fire({
            title: event.title,
            html: `
                Time: <span style="color: #e67e22">${event.start}</span> to <span style="color: #e74c3c">${event.end}</span><br/>
                Normal Rate: <strong style="color: #16a085">${event.normalRate}</strong><br/>
                Overtime Rate: <strong style="color: #f39c12">${event.overtimeRate}</strong>`,
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

		let addReleaseUI = "";
		if (this.props.message === "CLICK_TIME_SLOT" || this.props.message === "ADD_TIMESLOT_ERROR") {
			addReleaseUI = 
				<form id="addTimeslotForm" className="needs-validation" onSubmit= { handleSubmit(this.onTimeslotSubmit) }>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="TimeSlot_ID" type="text" id="timeslotID_add" label="Timeslot ID" placeholder="Enter a timeslot ID" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field alt="req" name="Create_By" type="text" id="createdBy_add" label="Created By" placeholder="Enter your name" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="Start_DateTime" type="text" id="startDateTime_add" label="Start D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field alt="req" name="End_DateTime" type="text" id="endDateTime_add" label="End D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
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
									<a className = "nav-link navi" data-toggle = "pill" href = "#ot">
											<i className="fas fa-sliders-h"></i><br/>
											Generate OT Rate
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
																	<label htmlFor = "empName" className = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
																	<div className = "col-8">
																			<select id = "empName" className = "form-control">
																					<option defaultValue>Choose employee</option>
																					<option>John</option>
																					<option>Joe</option>
																			</select>
																	</div>
															</div>

															<div className = "form-group row">
																	<label htmlFor = "period" className = "col-4 col-form-label font-weight-bold">Period: &nbsp;</label>
																	<div className = "col">
																			<select id = "period" className = "form-control">
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
																			<select id = "period" className = "form-control yrControl">
																					<option defaultValue>2020</option>
																					<option>2021</option>
																					<option>2022</option>
																			</select>
																	</div>
															</div>

															<div className = "row">
																	<button type = "button" className = "searchBtn">Search</button>
															</div>
													</form>
											</div>

											<div className = "col-6">
													<form>
															<div className = "form-group row">
																	<label htmlFor = "hours" className = "col-4 col-form-label font-weight-bold">Total Hours ($8/hr): &nbsp;</label>
																	<div className = "col-8">
																			<input id = "hours" type = "number" className = "form-control" readOnly></input>
																	</div>
															</div>

															<div className = "form-group row">
																	<label htmlFor = "totalot" className = "col-4 col-form-label font-weight-bold">Total OT: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "hours" type = "number" className = "form-control" readOnly></input>
																	</div>
															</div>

															<div className = "form-group row">
																	<label htmlFor = "otrate" className = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "otrate" type = "number" className = "form-control" readOnly></input>
																	</div>
															</div>

															<div className = "row">
																	<button type = "button" className = "payslipBtn">Generate Payslip</button>
															</div>
															
													</form>
											</div>
									</div>
							</div>

							<div id = "ot" className = "tab-pane">
									<div className = "row">
											<div className = "col-3"></div>
											<div className = "col-6">
													<form> 
															<div className = "form-group row">
																	<label htmlFor = "empName" className = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
																	<div className = "col-8">
																			<select id = "empName" className = "form-control">
																					<option defaultValue>Choose employee</option>
																					<option>John</option>
																					<option>Joe</option>
																			</select>
																	</div>
															</div>
							
															<div className = "form-group row">
																	<label htmlFor = "oldrate" className = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "oldrate" type = "number" className = "form-control" readOnly></input>
																	</div>
															</div>
							
															<div className = "form-group row">
																	<label htmlFor = "newrate" className = "col-4 col-form-label font-weight-bold">New OT Rate: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "newrate" type = "number" className = "form-control"></input>
																	</div>
															</div>
							
															<div className = "row">
																	<button type = "button" className = "updateBtn">Update</button>
															</div>
													</form>
											</div>
											<div className = "col-3"></div>
									</div>
							</div>

							<div id = "user" className = "tab-pane">
									<div className = "row">
											<div className = "col-3"></div>
											<div className = "col-6">
													<form>                     
															<div className = "form-group row">
																	<label htmlFor = "name" className = "col-4 col-form-label font-weight-bold">Name: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "name" type = "text" className = "form-control"></input>
																	</div>
															</div>
							
															<div className = "form-group row">
																	<label htmlFor = "email" className = "col-4 col-form-label font-weight-bold">Email: &nbsp;</label>
																	<div className = "col-8">
																			<input id = "email" type = "email" className = "form-control"></input>
																	</div>
															</div>

															<div className = "form-check">
																	<input className="form-check-input" type="checkbox" value="" id="adminCheckBox"></input>
																	<label className="form-check-label" htmlFor="adminCheckBox">
																			Admin
																	</label>
															</div>
							
															<div className = "row">
																	<button type = "button" className = "createBtn">Create</button>
															</div>
													</form>
											</div>
											<div className = "col-3"></div>
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
