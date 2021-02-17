import React from "react"
import "./Summary.css"
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

function TimeslotEntry(props) {
    return (
        <div className="std flex">
            <div className="timeslot-std flex timeslot-entry-r">
                <nav className="timeslot-std pad-r timeslot-entry-r">{props.date + " " + props.dayOfWeek}</nav>
                <nav className=""> {props.badge ? <Button variant="warning" size="sm" disabled>{props.badgeText}</Button> : null}</nav>
            </div>
            <div className="timeslot-std timeslot-entry-l">{props.startTime} - {props.endTime}</div>
        </div>
    )
}

function Summary() {
    const dayOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

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
                                        <DropdownButton id="dropdown-basic-button" title="2021">
                                            <Dropdown.Item href="">2021</Dropdown.Item>
                                            <Dropdown.Item href="">2020</Dropdown.Item>
                                            <Dropdown.Item href="">2019</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </td>
                                <td className="std">
                                    <Button variant="primary">Go!</Button>{' '}
                                </td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td className="st-card-std">
                                    <StatisticCard className="st-card-std" value="340" desc="Days worked"/>
                                </td>
                                <td className="">
                                    <StatisticCard className="st-card-std" value="500" desc="Hours worked"/>
                                </td>
                                <td>
                                    <StatisticCard className="st-card-std" value="50" desc="Hours OT"/>
                                </td>
                            </tr>
                        </table>
                        <h1 className="std header align-left">Total Earnings</h1>
                        <Chart />
                    </td>
                    <td className="align-top">
                        <table className="">
                            <tr className="">
                                <h1 className="std header align-left">Timeslots Registered</h1>
                            </tr>
                            <tr>
                                <TimeslotEntry date="17/2" dayOfWeek={dayOfWeek[2]} startTime="12pm" endTime="5.30pm" badge="true" badgeText="Upcoming"/>
                            </tr>
                            <tr>
                                <TimeslotEntry date="19/2" dayOfWeek={dayOfWeek[4]} startTime="8.30am" endTime="12pm" badge="true" badgeText="Upcoming"/>
                            </tr>
                            <tr>
                                <h1 className="std header align-left">Past Timeslots</h1>
                            </tr>
                            <tr>
                                <TimeslotEntry date="15/2" dayOfWeek={dayOfWeek[0]} startTime="12pm" endTime="5.30pm"/>
                            </tr>
                            <tr>
                                <TimeslotEntry date="14/2" dayOfWeek={dayOfWeek[6]} startTime="8.30am" endTime="12pm"/>
                            </tr>
                            <tr>
                                <TimeslotEntry date="12/2" dayOfWeek={dayOfWeek[4]} startTime="12pm" endTime="5.30pm"/>
                            </tr>
                            <tr>
                                <TimeslotEntry date="8/2" dayOfWeek={dayOfWeek[0]} startTime="12pm" endTime="5.30pm"/>
                            </tr>
                            <tr className="std">
                                <Button variant="outline-secondary" size="sm">More ↓</Button>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Summary
