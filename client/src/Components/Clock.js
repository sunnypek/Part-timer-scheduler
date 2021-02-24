import React, { Component } from 'react';
import axios from "axios";
import * as actions from "../actions";
import { compose } from "redux";
import { connect } from "react-redux";


class Clock extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      timeSlotID: event.target.timeSlotID.value,
      startDateTime: event.target.startDateTime.value,
      endDateTime: event.target.endDateTime.value,
      normalRate: event.target.normalRate.value,
      OTRate: event.target.OTRate.value
    };
    console.log(data);

    fetch("database/clockIn", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then((respData) => {
      console.log(respData);
    }).catch((err) => {
      console.log(err);
    });
  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="section-content-block section-process">

        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8 clock-form-wrapper text-center clearfix">
          <form onSubmit={event => this.handleSubmit(event)}>
              <div className="form-group col-md-6">
                <input name="timeSlotID" className="form-control" placeholder="TimseSlot" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="startDateTime" className="form-control" placeholder="startDateTime" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="endDateTime" className="form-control" placeholder="endDateTime" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="normalRate" className="form-control" placeholder="normalRate" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="OTRate" className="form-control" placeholder="OTRate" type="text" />
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

export default Clock;
