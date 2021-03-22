import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
//import { connect } from "react-redux";
//import { compose } from "redux";
/* import { reduxForm, Field } from "redux-form";*/
// eslint-disable-next-line
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';

/*import * as timeSlotActions from "../actions/addTimeslot";
import AddTimeslotInput from "./addTimeslotInput"; */
// import * as employeeActions from "../actions/getEmployees";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const local = momentLocalizer(moment);
let eventsList = [{}];

function AdminActions(){
 	const currentMonth = new Date().getMonth() + 1;
 	const currentYr = new Date().getFullYear();
	const username = localStorage.getItem("username");
	console.log(username);

	//const [data, setData] = useState([]);
 	const [data, setData] = useState({ results: [] });
	const [admindata, setAdminData] = useState();
	//const [attendanceData, setAttendanceData] = useState({ attendanceResults: [] });
	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYr); 
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [admin, setAdmin] = useState(false)

	const [currentEmp, setEmp] = useState("");
 
	useEffect(() => {
		var body = {};
		body['year'] = year;
		body['month'] = month;
		body['username'] = username;
		body['name'] = name;
		body['email'] = email;
		body['password'] = password;
		body['admin'] = admin;
		body['currentEmp'] = currentEmp;

		const fetchData = async () => {
			const result = await axios(
				'http://localhost:1337/database/getEmployees',
			);
		
			setData(result.data);
		};
		fetchData();
		
		const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        fetch('http://localhost:1337/database/admin', requestOptions)
            .then(response => response.json())
            .then(admindata => setAdminData(admindata));

		/*const fetchData2 = async () => {
			const res = await axios(
				'http://localhost:1337/database/attendance',
			);
			
			setAttendanceData(res.data);
		};
		fetchData2();*/
		
	}, [year, month, username, name, email, password, admin, currentEmp]);

	console.log("emp");
	console.log(data);
	//console.log(admindata);
	//console.log(currentEmp);
	//console.log("attendance");
	//console.log(attendanceData);

	const yrArray = [];
	const monthArray = [];
	//const empArray = [];
	const monthDropDownItems = [];
	const yrDropDownItems = [];
	//const empDropDownItems = [];
	const months = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];

	for (var i = 0; i < 10; i ++){
		yrArray[i] = currentYr - i;
	}

	for (var j = 1; j < 13; j ++){
		monthArray[j] = j;
	}

	const yrChange = event => {
		console.log(event.target.text);
		setYear(event.target.text);
	}

	const monthChange = event => {
		console.log(event.target.text);
		var num = months.indexOf(event.target.text);
		setMonth(num);
	}

	/* const empChange = event => {
		console.log(event.target.text);
		setData(event.target.text);
	} */

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setName(`${name}`);
		setEmail(`${email}`);
		setPassword(`${password}`);
		setAdmin(`${admin}`);
	}

	/* const handleInputChange = value => {
		setValue(value);
	}; */

	for (const [index, value] of yrArray.entries()){
		yrDropDownItems.push(<Dropdown.Item key = {index} href = "" onClick = {yrChange}>{value}</Dropdown.Item>);
	}

	for (const [index, value] of monthArray.entries()){
		monthDropDownItems.push(<Dropdown.Item key = {index} href = "" onClick = {monthChange}>{months[value]}</Dropdown.Item>);
	}

	var hoursWorked = 0;
	var hoursOT = 0;
	var databaseError;
	var otRate = 0;

	if(admindata != null) {
        databaseError = admindata.databaseError;
        console.log(databaseError);
		//hoursWorked = 1;
		

		for (var y = 0; y < admindata.payRate.length; y ++){
			otRate += admindata.payRate[y].OT_Rate;
		}

		/* for (var k = 0; k < admindata.bookingDetails[k].length(); k++){
			hoursWorked = 1;
			hoursOT += admindata.bookingDetails[k].OverTime_hr;
			//hoursWorked = admindata.bookingDetails[k].Normal_hr;
		} */

		for(var z = 0; z < admindata.bookingDetails.length; z++) {
            hoursWorked += admindata.bookingDetails[z].Normal_hr;
            hoursOT += admindata.bookingDetails[z].OverTime_hr;
			//hoursWorked = 1;
		}
	}
	

	const onChange = (item) => {
		item.preventDefault();
		setEmp(`${currentEmp}`);
		/* otRate = admindata.payRate.OT_Rate; */
		
	}

	console.log("data new");
	console.log(admindata);
	console.log(currentEmp);
	
	/* console.log(otRate); */
	console.log(hoursWorked);

	return (
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
                        Change OT Rate
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
											<Calendar 
												localizer={local}
												events={eventsList}
												startAccessor="start"
												endAccessor="end"
												style={{minHeight: 500}}
												views={['month']}/>
										</div>
										<div className="d-flex flex-column col-2 justify-content-center">
											<button type="button" className="btn btn-primary btn-lg my-2">Add Timeslot</button>
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
                                    <label for = "empName" className = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
                                    <div className = "col-8">
										<select className = "form-control" onClick = {e => setEmp(e.target.value)}>
											{data.results.map(item => (
												<option key={item.objectID}>
												{item.Employee_Name}
												</option>
											))}
										</select>
									</div>
                                </div>

                                <div className = "form-group row">
                                    <label for = "period" className = "col-4 col-form-label font-weight-bold">Period: &nbsp;</label>
                                    <div className = "col">
                                        <DropdownButton id = "dropdown-basic-button" variant = "outline-secondary" title = {months[month]} data-toggle = "dropdown">
											{monthDropDownItems}	
										</DropdownButton> 
                                    </div> &nbsp;
                                    <div className = "col">
										<DropdownButton id = "dropdown-basic-button" variant = "outline-secondary" title = {year} data-toggle = "dropdown">
											{yrDropDownItems}	
										</DropdownButton> 
                                    </div>
                                </div>

                               {/*  <div className = "row">
                                    <button type = "button" onClick = {onChange} className = "searchBtn">Search</button>
                                </div> */}
                            </form>
                        </div>

                        <div className = "col-6">
                            <form>
                                <div className = "form-group row">
                                    <label for = "hours" className = "col-4 col-form-label font-weight-bold">Total Hours ($8/hr): &nbsp;</label>
                                    <div className = "col-8">
										<div>{hoursWorked}</div>
                                    </div>
                                </div>

                                <div className = "form-group row">
                                    <label for = "totalot" className = "col-4 col-form-label font-weight-bold">Total OT: &nbsp;</label>
                                    <div className = "col-8">
                                        <div>{hoursOT}</div>
                                    </div>
                                </div>

                                <div className = "form-group row">
                                    <label for = "otrate" className = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
                                    <div className = "col-8">
                                        <div>{otRate}</div>
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
                                    <label for = "empName" className = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
                                    <div className = "col-8">
										<select className = "form-control" onClick = {e => setEmp(e.target.value)}>
											{data.results.map(item => (
												<option key={item.objectID}>
												{item.Employee_Name}
												</option>
											))}
										</select>
                                    </div>
                                </div>
                
                                <div className = "form-group row">
                                    <label for = "oldrate" className = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
                                    <div className = "col-8">
                                        {/* {otRate} */}
                                    </div>
                                </div>
                
                                <div className = "form-group row">
                                    <label for = "newrate" className = "col-4 col-form-label font-weight-bold">New OT Rate: &nbsp;</label>
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
                            <form onSubmit = {handleSubmit}>                     
                                <div className = "form-group row">
                                    <label for = "name" className = "col-4 col-form-label font-weight-bold">Name: &nbsp;</label>
                                    <div className = "col-8">
                                        <input id = "name" type = "text" value = {name} onChange = {e => setName(e.target.value)} className = "form-control"></input>
                                    </div>
                                </div>
                
                                <div className = "form-group row">
                                    <label for = "email" className = "col-4 col-form-label font-weight-bold">Email: &nbsp;</label>
                                    <div className = "col-8">
                                        <input id = "email" type = "email" value = {email} onChange = {e => setEmail(e.target.value)} className = "form-control"></input>
                                    </div>
                                </div>

								<div className = "form-group row">
									<label for = "password" className = "col-4 col-form-label font-weight-bold">Password: &nbsp;</label>
									<div className = "col-8">
										<input id = "password" type = "password" value = {password} onChange = {e => setPassword(e.target.value)} className = "form-control"></input>
									</div>
								</div>

                                <div className = "form-check">
                                    <input className="form-check-input" type="checkbox" value={admin} onChange = {() => setAdmin(!admin)} admin = {admin} id="adminCheckBox"></input>
                                    <label className="form-check-label" for="adminCheckBox">
                                        Admin
                                    </label>
                                </div>
                
                                <div className = "row">
								<input type="submit" value="Submit" className = "createBtn" />
                                </div>
                            </form>
                        </div>
                        <div className = "col-3"></div>
                    </div>
                </div>
            </div>
        </div>
	);
}

/*class Admin extends Component {
	
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
	render() {
		const { handleSubmit } = this.props;
		let alert = "";
		if (this.props.err) {
			switch (this.props.message) {
				case "ADD_TIMESLOT_ERROR":
					alert = <div className="alert alert-danger text-center d-flex justify-content-center" role="alert">Please check that all data are entered correctly! (make sure ID is not in use)</div>;
					break;
				case "PATCH_TIMESLOT_ERROR":
					alert = <div className="alert alert-danger text-center d-flex justify-content-center" role="alert">Timeslot ID and 1 other fields are required!</div>;
					break;
				case "DELETE_TIMESLOT_ERROR":
					alert = <div className="alert alert-danger text-center d-flex justify-content-center" role="alert">Check that the timeslot ID exist!</div>;
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
		} else if (this.props.message === "CLICK_TIME_SLOT_EDIT" || this.props.message === "PATCH_TIMESLOT_ERROR") {
			addReleaseUI = 
				<form id="editTimeslotForm" className="needs-validation" onSubmit= { handleSubmit(this.onTimeslotEdit) }>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="TimeSlot_ID" type="text" id="timeslotID_edit" label="Timeslot ID" placeholder="Enter a timeslot ID" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field name="Start_DateTime" type="text" id="startDateTime_edit" label="Start D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="End_DateTime" type="text" id="endDateTime_edit" label="End D/T" placeholder="Format (24H) - YYYY-MM-DD HH:MM:SS" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row">
						<div className="col-6 row">
							<Field name="Normal_Rate" type="number" id="normalRate_edit" label="Normal rate" placeholder="Normal rate per hour for this job" component={ AddTimeslotInput } />
						</div>
						<div className="col-6 row">
							<Field name="OT_Rate" type="number" id="overtimeRate_edit" label="OT rate" placeholder="Overtime rate per hour for this job" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row"><div className="col-3"></div><div className="col-6">{alert}</div><div className="col-3"></div></div>
					<div className = "row">
							<button type = "submit" className="searchBtn">Edit Timeslot</button>
							<button type = "button" className="searchBtn" onClick={this.props.cancelButton}>Cancel</button>
					</div>
				</form>
		} else if (this.props.message === "CLICK_TIME_SLOT_DELETE" || this.props.message === "DELETE_TIMESLOT_ERROR") {
			addReleaseUI = 
				<form id="deleteTimeslotForm" className="needs-validation" onSubmit= { handleSubmit(this.onTimeslotDelete) }>
					<div className="row">
						<div className="col-6 row">
							<Field alt="req" name="TimeSlot_ID" type="text" id="timeslotID_delete" label="Timeslot ID" placeholder="Enter a timeslot ID" component={ AddTimeslotInput } />
						</div>
					</div>
					<div className="row"><div className="col-3"></div><div className="col-6">{alert}</div><div className="col-3"></div></div>
					<div className = "row">
							<button type = "submit" className="searchBtn">Delete Timeslot</button>
							<button type = "button" className="searchBtn" onClick={this.props.cancelButton}>Cancel</button>
					</div>
				</form>
		} else if (this.props.message === "CANCEL" || this.props.message === "" || this.props.message === "SUCCESS") {
			if (this.state.gotData) {
				addReleaseUI = <Calendar localizer={local} events={eventsList} startAccessor="start" endAccessor="end" style={{minHeight: 500}} views={['month']}/>
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
										<button type="button" onClick={this.props.clickEditTimeslot} className="btn btn-success btn-lg my-2">Edit Timeslot</button>
										<button type="button" onClick={this.props.clickDeleteTimeslot} className="btn btn-danger btn-lg my-2">Delete Timeslot</button>
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
																	<select className = "form-control">
																		{data.results.map(item => (
																			<option key={item.objectID}>
																			{item.Employee_Name}
																			</option>
																		))}
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
)(Admin);*/

export default AdminActions;