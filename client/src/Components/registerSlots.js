import React, { Component } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { connect } from "react-redux";
import Swal from "sweetalert2";
// eslint-disable-next-line
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';

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

    selectEvent(event) {
        Swal.fire({
            title: event.title,
            html: `
                Add this to your booking?<br/>
                Time: <span style="color: #e67e22">${event.start}</span> to <span style="color: #e74c3c">${event.end}</span><br/>
                Normal Rate: <strong style="color: #16a085">$${event.normalRate}</strong><br/>
                Overtime Rate: <strong style="color: #f39c12">$${event.overtimeRate}</strong>
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
                        await axios.post("http://localhost:1337/database/book", data).then((res) => {
                            if (res.status === 200) Swal.fire({icon: "success",title: "Registered!"});
                        }).catch(Swal.fire({icon: "error",title: "Already registered for this slot!" }));
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