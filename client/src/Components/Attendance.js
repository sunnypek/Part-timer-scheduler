import React, {Component} from 'react';
import { connect } from "react-redux";
import * as attendanceDataActions from "../actions/attendanceData";
//import Modal from 'react-modal';
class Attendance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attendance: []
        }
    }

    // componentDidMount() {
    //     let self = this;
    //     fetch('/attendance', {
    //         method: 'GET'
    //     }).then(function(response) {
    //         if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //         }
    //         return response.json();
    //     }).then(function(data) {
    //         self.setState({attendance: data});
    //     }).catch(err => {
    //     console.log('Error aiyo!',err);
    //     })
    // }

    render() {
        return (
        <div className="container"> 
            <div className="panel panel-default p50 uth-panel">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Time Slot ID</th>
                            <th>Start Date Time</th>
                            <th>End Date Time</th>
                            <th>Normal Hour</th>
                            <th>OT Hour</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.attendance.map(timeslot =>
                        <tr key={timeslot.id}>
                        <td>{timeslot.timeSlotID} </td>
                        <td>{timeslot.clockIn} </td>
                        <td>{timeslot.clockOut}</td>
                        <td>{timeslot.normalHour}</td>
                        <td>{timeslot.overtimeHour}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}

export default connect(null, attendanceDataActions)(Attendance);