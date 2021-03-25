import React, { Component } from 'react';
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import axios from "axios";
import Swal from "sweetalert2";

let timeslots = [];

const getRoundedDate = (minutes, d=new Date()) => {

  let ms = 1000 * 60 * minutes; // convert minutes to ms
  let roundedDate = new Date(Math.floor(d.getTime() / ms) * ms);

  return roundedDate;
}

const timeNow = getRoundedDate(30).toISOString().slice(0, 19).replace("T", " ");
const hourOffset = parseInt(timeNow.slice(11,13)) + 8;
const convertedTimeNowToSave = timeNow.slice(0,11) + hourOffset.toString() + timeNow.slice(13);
let convertedTimeNow;
if (hourOffset > 12) {
  convertedTimeNow = timeNow.slice(0,11) + (hourOffset - 12).toString() + timeNow.slice(13, 16) + " PM";
} else {
  convertedTimeNow = timeNow.slice(0,11) + hourOffset.toString() + timeNow.slice(13, 16) + " AM";
}

class ClockOut extends Component {
  constructor(props){
    super(props);
    this.state = { gotData: false };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const result = await axios.get("http://localhost:1337/database/timeslots?username=" + localStorage.getItem("USERNAME"));
    timeslots = [];
    timeslots.push(<option key="first">Click to choose timeslot</option>)
    for (let i = 0; i < result.data.length; i++) {
      timeslots.push(<option key = {i}>{result.data[i].Timeslot_ID}</option>);
    };
    this.setState({ gotData: true });
  }

  async onSubmit(formData) {
    formData.clockOut = convertedTimeNowToSave;
    formData.employeeName = localStorage.getItem("USERNAME");
    if (!formData.hasOwnProperty("timeslotID") || formData.timeslotID === "Click to choose timeslot") {
      Swal.fire({
        icon: "error",
        text: "Please choose a timeslot!"
      });
    } else {
      const result = await axios.post("http://localhost:1337/database/clockOut", formData);
      if (result.data.updated) {
        Swal.fire({
          icon: "success",
          text: "Successfully clocked out!"
        });
      } else {
        if (result.data.clockIn) {
          Swal.fire({
            icon: "warning",
            text: "Already clocked out!"
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "You have not clocked in for this timeslot!"
          });
        }
      }
    }
	}

  render() {
    const { handleSubmit } = this.props;

    let UI;
    if (this.state.gotData) {
      UI =  <form onSubmit={ handleSubmit(this.onSubmit) }>
            <div>
              <fieldset>
                <label htmlFor="timeslotID">Select a timeslot</label>
                <Field name="timeslotID" id="timeslotID" type="select" component= "select" className="form-control">
                  {timeslots}
                </Field>
              </fieldset>
              <fieldset>
                <label htmlFor="clockInTimeNow">Clock time time (rounded down to nearest half hour)</label>
                <input className="form-control mb-3" id="clockInTimeNow" value={convertedTimeNow} readOnly />
              </fieldset>

              <button type="submit" className="btn btn-primary">Clock out</button>
            </div>
            </form>;
    } else {
      UI = <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>;
    }

    return (
      <div className="row justify-content-center">
				<div className="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-10">
						{ UI }
				</div>
			</div>
    );
  }
}

export default compose(
  reduxForm({ form: "clockout" })
)(ClockOut);
