import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from "axios";
import Select from 'react-select';

import * as clockingActions from "../actions/clockInOut";

class ClockIn extends Component {
  

  constructor(props){
    super(props)
    this.state = {
      selectOptions : [],
      id: ""
    }
  }

  // async getOptions(){
  //   //const res = await axios.get('http://localhost:1337/database/getTimeslotID')
  //   //const data = res.data

  //   const options = data.map(d => ({
  //     "value" : d.id
  //   }))
  //   this.setState({selectOptions: options})
  // }

  componentDidMount(){
    this.getOptions()
}

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      timeslotID: event.target.timeslotID.value,
      employeeName: localStorage.getItem("USERNAME"),
			clockIn: event.target.clockIn.value,
			clockOut: event.target.clockOut.value,
			normalHour: event.target.normalHour.value,
			overtimeHour: event.target.overtimeHour.value
    };
    console.log(data);
		this.props.clockIn(data);
    
  }

  handleChange(e){
    this.setState({id:e.value})
   }
  

  render() {
		// eslint-disable-next-line
    const { handleSubmit } = this.props;
    console.log(this.state.selectOptions);


  

    const timeNow = new Date().toISOString().split('T')[0]+' '+ new Date().toTimeString().split(' ')[0];
    
    return (
      <div className="section-content-block section-process">

        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8 clock-form-wrapper text-center clearfix">
          <form onSubmit={event => this.handleSubmit(event)}>

                <div className = "form-group row">
                  <label for = "timeslotID" className = "col-4 col-form-label font-weight-bold">Timeslot ID: &nbsp;</label>
                    <div className = "col-8">
                    <select className = "form-control">
                      {/* {data.map(item => (
                        <option key={item.objectID}>
                        {item.TimeSlot_ID}
                        </option>
                      ))} */}
                    </select>
                    </div>
              </div>


              <div className="form-group col-md-6">
                <input name="clockIn" className="form-control" placeholder={ timeNow } type="text" value={ timeNow }/>
              </div>
              <div className="form-group col-md-6">
                <input name="clockOut" className="form-control" placeholder="Leave empty for clocking in" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="normalHour" className="form-control" placeholder="Normal Hour" type="text" />
              </div>
              <div className="form-group col-md-6">
                <input name="overtimeHour" className="form-control" placeholder="Overtime Hour" type="text" />
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

export default connect(null, clockingActions)(ClockIn);
