import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// eslint-disable-next-line
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';

import "./admin.css"

const local = momentLocalizer(moment);

const eventsList = [{
	title: "test",
	start: "2021-03-09 13:00:00",
	end: "2021-03-09 14:00:00",
	allDay: false
}]

function Admin(props){
    return(
        <div>
            <ul class = "nav-content nav nav-pills nav-justified">
                <li class = "nav-item col-3">
                    <a class = "nav-link navi" data-toggle = "pill" href = "#timeslot">
                        <i class="fa fa-calendar"></i><br/>
                        Add/ Release Timeslots
                    </a>
                </li>
                <li class = "nav-item col-3">
                    <a class = "nav-link navi" data-toggle = "pill" href = "#payroll">
                        <i class="fas fa-envelope-open-text"></i><br/>
                        Generate Payroll
                    </a>
                </li>
                <li class = "nav-item col-3">
                    <a class = "nav-link navi" data-toggle = "pill" href = "#ot">
                        <i class="fas fa-sliders-h"></i><br/>
                        Generate OT Rate
                    </a>
                </li>
                <li class = "nav-item col-3">
                    <a class = "nav-link navi" data-toggle = "pill" href = "#user">
                        <i class="fas fa-plus"></i><br/>
                        Create New User
                    </a>
                </li>
            </ul>

            <div class = "tab-content">
                <div id = "timeslot" class = "tab-pane active mb-5">
									<div class="row">
										<div class="col-10">
											<Calendar 
												localizer={local}
												events={eventsList}
												startAccessor="start"
												endAccessor="end"
												style={{minHeight: 500}} />
										</div>
										<div class="d-flex flex-column col-2 justify-content-center">
											<button type="button" class="btn btn-primary btn-lg my-2">Add Timeslot</button>
											<button type="button" class="btn btn-success btn-lg my-2">Edit Timeslot</button>
											<button type="button" class="btn btn-danger btn-lg my-2">Delete Timeslot</button>
										</div>
									</div>
                </div>

                <div id = "payroll" class = "tab-pane">
                    <div class = "row">
                        <div class = "col-6">
                            <form> 
                                <div class = "form-group row">
                                    <label for = "empName" class = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
                                    <div class = "col-8">
                                        <select id = "empName" class = "form-control">
                                            <option selected>Choose employee</option>
                                            <option>John</option>
                                            <option>Joe</option>
                                        </select>
                                    </div>
                                </div>

                                <div class = "form-group row">
                                    <label for = "period" class = "col-4 col-form-label font-weight-bold">Period: &nbsp;</label>
                                    <div class = "col">
                                        <select id = "period" class = "form-control">
                                            <option selected>January</option>
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
                                    <div class = "col">
                                        <select id = "period" class = "form-control yrControl">
                                            <option selected>2020</option>
                                            <option>2021</option>
                                            <option>2022</option>
                                        </select>
                                    </div>
                                </div>

                                <div class = "row">
                                    <button type = "button" class = "searchBtn">Search</button>
                                </div>
                            </form>
                        </div>

                        <div class = "col-6">
                            <form>
                                <div class = "form-group row">
                                    <label for = "hours" class = "col-4 col-form-label font-weight-bold">Total Hours ($8/hr): &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "hours" type = "number" class = "form-control" readonly></input>
                                    </div>
                                </div>

                                <div class = "form-group row">
                                    <label for = "totalot" class = "col-4 col-form-label font-weight-bold">Total OT: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "hours" type = "number" class = "form-control" readonly></input>
                                    </div>
                                </div>

                                <div class = "form-group row">
                                    <label for = "otrate" class = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "otrate" type = "number" class = "form-control" readonly></input>
                                    </div>
                                </div>

                                <div class = "row">
                                    <button type = "button" class = "payslipBtn">Generate Payslip</button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>

                <div id = "ot" class = "tab-pane">
                    <div class = "row">
                        <div class = "col-3"></div>
                        <div class = "col-6">
                            <form> 
                                <div class = "form-group row">
                                    <label for = "empName" class = "col-4 col-form-label font-weight-bold">Employee Name: &nbsp;</label>
                                    <div class = "col-8">
                                        <select id = "empName" class = "form-control">
                                            <option selected>Choose employee</option>
                                            <option>John</option>
                                            <option>Joe</option>
                                        </select>
                                    </div>
                                </div>
                
                                <div class = "form-group row">
                                    <label for = "oldrate" class = "col-4 col-form-label font-weight-bold">Current OT Rate: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "oldrate" type = "number" class = "form-control" readonly></input>
                                    </div>
                                </div>
                
                                <div class = "form-group row">
                                    <label for = "newrate" class = "col-4 col-form-label font-weight-bold">New OT Rate: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "newrate" type = "number" class = "form-control"></input>
                                    </div>
                                </div>
                
                                <div class = "row">
                                    <button type = "button" class = "updateBtn">Update</button>
                                </div>
                            </form>
                        </div>
                        <div class = "col-3"></div>
                    </div>
                </div>

                <div id = "user" class = "tab-pane">
                    <div class = "row">
                        <div class = "col-3"></div>
                        <div class = "col-6">
                            <form>                     
                                <div class = "form-group row">
                                    <label for = "name" class = "col-4 col-form-label font-weight-bold">Name: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "name" type = "text" class = "form-control"></input>
                                    </div>
                                </div>
                
                                <div class = "form-group row">
                                    <label for = "email" class = "col-4 col-form-label font-weight-bold">Email: &nbsp;</label>
                                    <div class = "col-8">
                                        <input id = "email" type = "email" class = "form-control"></input>
                                    </div>
                                </div>

                                <div class = "form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="adminCheckBox"></input>
                                    <label class="form-check-label" for="adminCheckBox">
                                        Admin
                                    </label>
                                </div>
                
                                <div class = "row">
                                    <button type = "button" class = "createBtn">Create</button>
                                </div>
                            </form>
                        </div>
                        <div class = "col-3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default Admin;
