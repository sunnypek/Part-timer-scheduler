import React, {Component} from 'react';
import { connect } from "react-redux";
import * as attendanceDataActions from "../actions/attendanceData";

class Attendance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attendance: []
        }
    }

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
                        <td>{timeslot.Timeslot_ID} </td>
                        <td>{timeslot.Clock_IN} </td>
                        <td>{timeslot.Clock_OUT}</td>
                        <td>{timeslot.Normal_hr}</td>
                        <td>{timeslot.OverTime_hr}</td>
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