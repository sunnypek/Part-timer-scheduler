import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
// eslint-disable-next-line
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';

import * as timeSlotActions from "../actions/addTimeslot";
import AddTimeslotInput from "./addTimeslotInput";

const local = momentLocalizer(moment);

const eventsList = [{
	title: "test",
	start: "2021-03-09 13:00:00",
	end: "2021-03-09 14:00:00",
	allDay: false
}]

class Admin extends Component {
	constructor(props) {
		super(props);
		this.onTimeslotSubmit = this.onTimeslotSubmit.bind(this);
	}
	
	async onTimeslotSubmit(formData) {
		await this.props.addTimeslot(formData);
	}

	render() {
		const { handleSubmit } = this.props;

		let alert = "";
		if (this.props.err) {
			alert = <div className="alert alert-danger text-center d-flex justify-content-center" role="alert">Please check that all data are entered correctly! (make sure ID is not in use)</div>;
		}

		let addReleaseUI = "";
		if (this.props.message === "CLICK_TIME_SLOT" || this.props.message === "ADD_TIMESLOT_ERROR") {
			addReleaseUI = 
				<form className="needs-validation" onSubmit= { handleSubmit(this.onTimeslotSubmit) }>
					<div className="row">
						<div className="col-6 row">
							<Field name="timeslotID" type="text" id="timeslotID" label="Timeslot ID" placeholder="Enter a timeslot ID" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="createdBy" type="text" id="createdBy" label="Created By" placeholder="Enter your name" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field name="startDateTime" type="text" id="startDateTime" label="Start D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="endDateTime" type="text" id="endDateTime" label="End D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field name="normalRate" type="number" id="normalRate" label="Normal rate" placeholder="Normal rate per hour for this job" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="overtimeRate" type="number" id="overtimeRate" label="OT rate" placeholder="Overtime rate per hour for this job" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row"><div className="col-3"></div><div className="col-6">{alert}</div><div className="col-3"></div></div>
					<div className = "row">
							<button type = "submit" className="searchBtn">Add Timeslot</button>
							<button type = "button" className="searchBtn" onClick={this.props.cancelButton}>Cancel</button>
					</div>
				</form>
		} else if (this.props.message === "CANCEL" || this.props.message === "" || this.props.message === "SUCCESS") {
			addReleaseUI = <Calendar localizer={local} events={eventsList} startAccessor="start" endAccessor="end" style={{minHeight: 500}} views={['month']}/>
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
										<button type="button" className="btn btn-success btn-lg my-2">Edit Timeslot</button>
										<button type="button" className="btn btn-danger btn-lg my-2">Delete Timeslot</button>
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
		err: state.admin.err
	}
}

export default compose(
	connect(MapStateToProps, timeSlotActions),
	reduxForm({ form: "addTimeslot" })
)(Admin);
