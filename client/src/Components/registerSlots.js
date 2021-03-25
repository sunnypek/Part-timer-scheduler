import React, { Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const local = momentLocalizer(moment);
let eventsList = [{}];

class RegisterSlots extends Component {
    constructor(props) {
		super(props);
		this.state = {gotData: false};
	}

    async componentDidMount() {
		const result = await axios.get("http://localhost:1337/database/timeslot");
		eventsList = result.data;
		this.setState({ gotData: true });
	}

    async selectEvent(event) {
        const result = await axios.get(`http://localhost:1337/database/book?timeslotID=${event.title}`);
        let registeredUsers = "";
        if (result.data.length > 0) {
            registeredUsers += "<ol style='padding-left: 1rem;'>";
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].Employee_Name === localStorage.getItem("USERNAME")) {
                    registeredUsers += `<li style="color:#e74c3c">${result.data[i].Employee_Name}</li>`;
                } else {
                    registeredUsers += `<li>${result.data[i].Employee_Name}</li>`;
                }
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
        Swal.fire({
            title: event.title,
            html: `
                <div class="row">
                    <div class="col-12">Add this to your booking?<br/><br/></div>
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
                        Registered users:
                    </div>
                    <div class="col-6" style="text-align:left">
                        ${registeredUsers}
                    </div>
                </div>
            `,
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "question",
                    title: "Confirm?",
                    html: "<span style='color: #e74c3c'>You cannot modify or unregister!</span>",
                    showDenyButton: true,
                    confirmButtonText: "Yes"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const data = {
                            Timeslot_ID: event.title,
                            Employee_Name: localStorage.getItem("USERNAME"),
                            Normal_hr: event.normalRate,
                            OverTime_hr: event.overtimeRate
                        };
                        const res = await axios.post("http://localhost:1337/database/book", data)
                        if (res.data.alreadybooked) {
                            Swal.fire({icon: "error",title: "Already registered for this slot!" });
                        } else {
                            Swal.fire({icon: "success",title: "Registered!"});
                        }
                    };
                });
                
            }
        });
    }

    render() {
        let registerSlotsCalendar;
        if (this.state.gotData) {
            registerSlotsCalendar = <Calendar popup localizer={local} onSelectEvent={this.selectEvent} events={eventsList} startAccessor="start" endAccessor="end" style={{minHeight: 500}} views={['month']} />
        } else {
            registerSlotsCalendar = <div className="d-flex justify-content-center">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>;
        }

        return (
            <div>
                {registerSlotsCalendar}
            </div>
        );
    }
};

function MapStateToProps(state) {
	return {
		gotData: state.admin.gotData
	}
}

export default connect(MapStateToProps)(RegisterSlots);