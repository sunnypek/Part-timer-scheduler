import React, {useState, useEffect} from "react"
import DropdownButton from "react-bootstrap/DropdownButton"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Chart from "./Chart.js"

function StatisticCard(props) {
    return (
        <div className="st-card-std">
        <Card className="card-size-std" bg={props.bg}>
            <Card.Body>
                <Card.Title className="card-title-std">{props.value}</Card.Title>
                <Card.Text className="card-text-std">{props.desc}</Card.Text>
            </Card.Body>
        </Card>
        </div>
    )
}

function TimeslotEntryHTML(props) {
    return (
        <div className="std flex">
            <div className="timeslot-std flex timeslot-entry-r">
                <nav className="timeslot-std pad-r timeslot-entry-r">{props.date + " " + props.dayOfWeek}</nav>
                <nav className=""> {props.badge ? <Button variant={props.variant} size="sm" disabled>{props.badgeText}</Button> : null}</nav>
            </div>
            <div className="timeslot-std timeslot-entry-l">{props.startTime} - {props.endTime}</div>
        </div>
    )
}

function TimeslotEntry(props) {
    return (
        <tr>
            <TimeslotEntryHTML 
                date = {
                    props.tempDay + 
                    "/" + 
                    props.tempMonth
                } 
                dayOfWeek={props.dayOfWeek} 
                startTime = {
                    ((props.tempClockInHours > 12) ? props.tempClockInHours - 12 : props.tempClockInHours) +
                    "." +
                    ((props.tempClockInMinutes < 10) ? ("0" + props.tempClockInMinutes) : props.tempClockInMinutes) +
                    ((props.tempClockInHours <= 12) ? "am" : "pm")
                } 
                endTime = {
                    (props.status === "Ongoing") ? 
                    "Ongoing" 
                    :
                    ((props.tempClockOutHours > 12) ? props.tempClockOutHours - 12 : props.tempClockOutHours) +
                    "." +
                    ((props.tempClockOutMinutes < 10) ? ("0" + props.tempClockOutMinutes) : props.tempClockOutMinutes) +
                    ((props.tempClockOutHours < 12) ? "am" : "pm")
                }
                badge = { 
                    (props.status === "Ongoing" || props.status === "Upcoming") ? true : false
                }
                badgeText = {
                    (props.status === "Ongoing") ? "Ongoing" : (props.status === "Upcoming") ? "Upcoming" : ""
                }
                variant = {
                    (props.status === "Ongoing") ? "success" : (props.status === "Upcoming") ? "primary" : ""
                }
            />
        </tr>
    )
}

function Summary() {
    const dayOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const yearArray = [];
    const yearDropdownItems = [];
    var currentYearBool = false;

    for(var i = 0; i < 5; i++) {
        yearArray[i] = currentYear - i;
    }

    const [year, setYear] = useState(currentYear);

    const handleChange = event => {
        setYear(event.target.text);
    }

    for(const [index, value] of yearArray.entries()) {
        yearDropdownItems.push(<Dropdown.Item key={index} href="" onClick={handleChange}>{value}</Dropdown.Item>);
    }

    const [data, setData] = useState();
    
    const username = localStorage.getItem("USERNAME");

    useEffect(() => {
        var body = {};
        body["year"] = year;
        body["username"] = username;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch('http://localhost:1337/database/summary', requestOptions)
            .then(response => response.json())
            .then(data => setData(data));
    }, [year, username])

    if(year === currentYear) 
        currentYearBool = true;
    else 
        currentYearBool = false;

    var daysWorked = 0;
    var hoursWorked = 0;
    var minutesWorked = 0;
    var hoursOT = 0;
    var upcomingTimeSlots = [];
    var pastTimeSlots = [];
    var tempDay;
    var tempMonth;
    var tempDayOfWeekIndex;
    var tempClockInHours;
    var tempClockInMinutes;
    var tempClockOutHours;
    var tempClockOutMinutes;
    var databaseError;
    var earnings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if(data != null) {
        databaseError = data.databaseError;

        // Extract data for 3 cards
        daysWorked = data.daysWorked;
        minutesWorked = data.hoursWorked.diff_minute;
        hoursWorked = data.hoursWorked.diff_hours;

        // Extract data fro graph
        earnings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(var g = 0; g < data.monthEarnings.length; g++) {
            earnings[data.monthEarnings[g].mth-1] = data.monthEarnings[g].earnings;
        }

        // Convert 60mins to 1hr
        while(minutesWorked >= 60) {
            minutesWorked -= 60;
            hoursWorked++;
        }

        hoursWorked = (hoursWorked * 1.0 + minutesWorked/60);

        // Unbox query results
        for(var z = 0; z < data.bookingDetails.length; z++) {

            hoursOT += data.bookingDetails[z].OverTime_hr;
            
            for(var y = 0; y < data.timeslotDetails.length; y++) {

                // Match entry in bookingdetail to timeslot
                if(data.bookingDetails[z].Timeslot_ID === data.timeslotDetails[y].TimeSlot_ID) {

                    // Load entry details
                    tempDay = new Date(data.bookingDetails[z].Clock_IN).getDate().toString();
                    tempMonth = (new Date(data.bookingDetails[z].Clock_IN).getMonth() + 1).toString();
                    tempDayOfWeekIndex = data.timeslotDetails[y].day_of_week - 1;
                    tempClockInHours = new Date(data.bookingDetails[z].Clock_IN).getHours().toString();
                    tempClockInMinutes = new Date(data.bookingDetails[z].Clock_IN).getMinutes().toString();
                    tempClockOutHours = new Date(data.bookingDetails[z].Clock_OUT).getHours().toString();
                    tempClockOutMinutes = new Date(data.bookingDetails[z].Clock_OUT).getMinutes().toString();

                    // Past Timeslots
                    if(data.bookingDetails[z].Clock_IN != null && data.bookingDetails[z].Clock_OUT != null) {
                        pastTimeSlots.push(
                            <TimeslotEntry 
                                tempDay={tempDay} 
                                tempMonth={tempMonth} 
                                dayOfWeek={dayOfWeek[tempDayOfWeekIndex]}
                                tempClockInHours={tempClockInHours}
                                tempClockInMinutes={tempClockInMinutes}
                                tempClockOutHours={tempClockOutHours}
                                tempClockOutMinutes={tempClockOutMinutes}
                                status=""
                            />
                        );
                    } 

                    // Ongoing Timeslots
                    else if(data.bookingDetails[z].Clock_IN != null && data.bookingDetails[z].Clock_OUT == null) {
                        upcomingTimeSlots.push(
                            <TimeslotEntry 
                                tempDay={tempDay} 
                                tempMonth={tempMonth} 
                                dayOfWeek={dayOfWeek[tempDayOfWeekIndex]}
                                tempClockInHours={tempClockInHours}
                                tempClockInMinutes={tempClockInMinutes}
                                tempClockOutHours={tempClockOutHours}
                                tempClockOutMinutes={tempClockOutMinutes}
                                status="Ongoing"
                            />
                        );
                    }    

                    // Upcoming Timeslots
                    else {

                        // Load entry details from timeslot instead
                        tempDay = new Date(data.timeslotDetails[y].Start_DateTime).getDate().toString();
                        tempMonth = (new Date(data.timeslotDetails[y].Start_DateTime).getMonth() + 1).toString();
                        tempDayOfWeekIndex = data.timeslotDetails[y].day_of_week - 1;
                        tempClockInHours = new Date(data.timeslotDetails[y].Start_DateTime).getHours().toString();
                        tempClockInMinutes = new Date(data.timeslotDetails[y].Start_DateTime).getMinutes().toString();
                        tempClockOutHours = new Date(data.timeslotDetails[y].End_DateTime).getHours().toString();
                        tempClockOutMinutes = new Date(data.timeslotDetails[y].End_DateTime).getMinutes().toString();

                        upcomingTimeSlots.push(
                            <TimeslotEntry 
                                tempDay={tempDay} 
                                tempMonth={tempMonth} 
                                dayOfWeek={dayOfWeek[tempDayOfWeekIndex]}
                                tempClockInHours={tempClockInHours}
                                tempClockInMinutes={tempClockInMinutes}
                                tempClockOutHours={tempClockOutHours}
                                tempClockOutMinutes={tempClockOutMinutes}
                                status="Upcoming"
                            />
                        );
                    }
                }
            }
        }
    } 

    return (
        <div className="std">
            <table>
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td>
                                    <label className="std">Summary For</label>
                                </td>
                                <td>
                                    <div className="std">
                                        <DropdownButton id="dropdown-basic-button" title={year} data-toggle="dropdown">
                                            {yearDropdownItems}
                                        </DropdownButton>
                                    </div>
                                </td>
                                <td className="std">
                                    <Button variant="danger" disabled className={(databaseError) ? "visible" : "invisible"}>No data found!</Button>{' '}
                                </td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td className="st-card-std">
                                    <StatisticCard className="st-card-std" value={daysWorked} desc="Day(s) worked"/>
                                </td>
                                <td className="">
                                    <StatisticCard className="st-card-std" value={Number(hoursWorked).toFixed(1)} desc="Hour(s) worked"/>
                                </td>
                                <td>
                                    <StatisticCard className="st-card-std" value={hoursOT} desc="Hour(s) OT"/>
                                </td>
                            </tr>
                        </table>
                        <h1 className="std header align-left">Total Earnings</h1>
                        <Chart earnings={earnings} month={currentMonth} currentYear={currentYearBool}/>
                    </td>
                    <td className="align-top">
                        <table className="">
                            <tr className="">
                                <h1 className="std header align-left">Timeslots Registered</h1>
                            </tr>
                                {upcomingTimeSlots}
                            <tr>
                                <h1 className="std header align-left">Past Timeslots</h1>
                            </tr>
                                {pastTimeSlots}
                            <tr className="std">
                                <Button variant="outline-secondary" size="sm" className="invisible">More ↓</Button>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Summary
