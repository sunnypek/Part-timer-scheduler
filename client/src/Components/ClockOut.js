import React, { Component } from 'react';
import { connect } from "react-redux";

import * as clockingActions from "../actions/clockInOut";

class ClockOut extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      timeslotID: event.target.timeslotID.value,
      employeeName: event.target.employeeName.value,
			clockOut: event.target.clockOut.value,
    };
    console.log(data);
		this.props.clockOut(data);
    
  }

  render() {
		// eslint-disable-next-line
    const { handleSubmit } = this.props;
    const timeNow = new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0];
    return (
      <div className="section-content-block section-process">

        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8 clock-form-wrapper text-center clearfix">
          <form onSubmit={event => this.handleSubmit(event)}>
              <div className="form-group col-md-6">
                <input name="timeslotID" className="form-control" placeholder="Timeslot ID" type="text" />
              </div>
							<div className="form-group col-md-6">
                <input name="employeeName" className="form-control" placeholder="Employee Name" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="clockOut" className="form-control" placeholder={ timeNow } type="text" value={ timeNow } />
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <button className="btn-submit" type="submit">Submit</button>
              </div>
            </form>
          </div>
          <div className="col-md-2" />
        </div>
      </div>
    );
  }
}

export default connect(null, clockingActions)(ClockOut);
