import React, {useState, useEffect} from "react"
//import { MonthPicker, YearPicker } from "react-dropdown-date";
import DropdownButton from "react-bootstrap/DropdownButton"
import Dropdown from "react-bootstrap/Dropdown"

const column = {
    padding: "5px",
    width: "50%",
    float: "left"
};
const td = {
    textalign: "left",
    padding: "16px"
};
const th = {
    textalign: "left",
    padding: "10px",
    backgroundColor: "#f9e79f",
    width: "1000px"
};
const th2 = {
    textalign: "right",
    padding: "10px",
    backgroundColor: "#f9e79f"
};
const th3 = {
    textalign: "right",
    padding: "10px",
};
const divformat = {
    display: "flex"
};
const fomatleft = {
    marginLeft: "auto"
};
const dropdownBtn = {
    backgroundColor: "#FFFFFF",
    padding: "28px",
    maxWidth: "10px",
    overflow: "hidden"
};

function PaySlip(){
    const currentMonth = new Date().getMonth() + 1;
    const [month, setMonth] = useState(currentMonth);
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState();

    const username = localStorage.getItem("USERNAME");

    useEffect(() => {
        var body = {};
        body["year"] = year;
        body["month"] = month;
        body["username"] = username;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch('http://localhost:1337/database/payslip', requestOptions)
            .then(response => response.json())
            .then(data => setData(data));
    }, [year, month, username])
    
    const yearArray = [];
    const monthArray = [];
    const monthDropdownItems = [];
    const yearDropdownItems = [];
    const monthName = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];
    for(var i = 0; i < 50; i++) {
        yearArray[i] = currentYear - i;
    }
    for(var j=1; j < 13; j++) {
        monthArray[j] = j ;
    }

    const YrHandleChange = event => {
        console.log(event.target.text);
        setYear(event.target.text);
    }

    const MonHandleChange = event => {
        console.log(event.target.text);
        var num = monthName.indexOf(event.target.text)
        setMonth(num);
    }

    for(const [index, value] of yearArray.entries()) {
        yearDropdownItems.push(<Dropdown.Item key={index} href="" onClick={YrHandleChange}>{value}</Dropdown.Item>);
    }

    for(const [index, value] of monthArray.entries()) {
        monthDropdownItems.push(<Dropdown.Item key={index} href="" onClick={MonHandleChange}>{monthName[value]}</Dropdown.Item>);
    }

    var hoursWorked = 0;
    var hoursOT = 0;
    var databaseError;
    var OTtotal = 0;
    var NormTotal = 0;

    if (data != null) {
        databaseError = data.databaseError;
        console.log(databaseError);
        
        for(var z = 0; z < data.payslipbookingDetails.length; z++) {
            hoursWorked += data.payslipbookingDetails[z].Normal_hr;
            hoursOT += data.payslipbookingDetails[z].OverTime_hr;
            
            for(var y = 0; y < data.paysliptimeslotDetails.length; y++) {
                
                // Match entry in bookingdetail to timeslot
                if(data.payslipbookingDetails[z].Timeslot_ID === data.paysliptimeslotDetails[y].TimeSlot_ID) {
                    if(data.payslipbookingDetails[z].Clock_IN != null && data.payslipbookingDetails[z].Clock_OUT != null) {
                        OTtotal += (data.payslipbookingDetails[z].OverTime_hr * data.paysliptimeslotDetails[y].OT_Rate);
                        NormTotal += (data.payslipbookingDetails[z].Normal_hr * data.paysliptimeslotDetails[y].Normal_Rate);
                    } 

                    
                }
            }
        }
        var totalTime = hoursWorked + hoursOT;
        if (totalTime < 10) totalTime = '0'+ totalTime;
        var salary = NormTotal
        var OTSalary = OTtotal
        var totalsalary = (salary + OTSalary);
        var employeeCPF = (0.20 * totalsalary)
        var employerCPF = (0.17 * totalsalary)
        var cdac = (0).toFixed(2);
        var finalSalary = 0;

        if (totalsalary !== 0) {
            if (totalsalary <= 2000){
                cdac = 0.50.toFixed(2);
            }
            else if (totalsalary > 2000){
                cdac = 1.00.toFixed(2);
            }
            else if (totalsalary > 3500){
                cdac = 1.50.toFixed(2);
            }
            else if (totalsalary > 5000){
                cdac = 2.00.toFixed(2);
            }
            else if (totalsalary > 7500){
                cdac = 3.00.toFixed(2);
            }
        }

        finalSalary = (totalsalary - employeeCPF - cdac).toFixed(2);
        totalsalary = totalsalary.toFixed(2);
        employeeCPF = employeeCPF.toFixed(2);
        employerCPF = employerCPF.toFixed(2);
        salary = salary.toFixed(2);
        OTSalary = OTSalary.toFixed(2);
    };
    
    return (
        <div>
            <h1>Welcome {username}</h1>
            <h2>My Payslips</h2>
            <div style={divformat}>
                <DropdownButton id="dropdown-basic-button" title={monthName[month]} data-toggle="dropdown" bsPrefix={dropdownBtn}>
                    {monthDropdownItems}
                </DropdownButton>
                <DropdownButton id="dropdown-basic-button" title={year} data-toggle="dropdown" bsPrefix={dropdownBtn}>
                    {yearDropdownItems}
                </DropdownButton>
            </div>

            <div style={divformat}>
                <p style={fomatleft}>Hours Worked (Per Month): {totalTime} hours (Include OT)</p>
            </div>
            
            <div className="row">
                <div style={column}>
                    <table>
                        <tr>
                            <th style={th}>Payments</th>
                            <th style={th2}>SGD$</th>
                        </tr>
                        <tr>
                            <td style={td}>Salary</td>
                            <th style={th3}>${salary}</th>
                        </tr>
                        <tr>
                            <td style={td}>Overtime</td>
                            <th style={th3}>${OTSalary}</th>
                        </tr>
                        <tr>
                            <td style={td}>Total</td>
                            <th style={th3}>${totalsalary}</th>
                        </tr>
                    </table>
                </div>
            
                <div style={column}>
                    <table>
                        <tr>
                            <th style={th}>Deductions</th>
                            <th style={th2}>SGD$</th>
                        </tr>
                        <tr>
                            <td style={td}>CDAC</td>
                            <th style={th3}>${cdac}</th>
                        </tr>
                        <tr>
                            <td style={td}>Total</td>
                            <th style={th3}>${cdac}</th>
                        </tr>
                    </table>
                </div>
                <div style={column}>
                    <table>
                        <tr>
                            <th style={th}>CPF Constributions</th>
                            <th style={th2}>SGD$</th>
                        </tr>
                        <tr>
                            <td style={td}>Employer's CPF</td>
                            <th style={th3}>${employerCPF}</th>
                        </tr>
                        <tr>
                            <td style={td}>Employee's CPF</td>
                            <th style={th3}>${employeeCPF}</th>
                        </tr>
                    </table>
                </div>
                <div style={column}>
                    <table>
                        <tr>
                            <th style={th}>Earnings</th>
                            <th style={th2}>SGD$</th>
                        </tr>
                        <tr>
                            <td style={td}>Nett Salary</td>
                            <th style={th3}>${finalSalary}</th>
                        </tr>
                        <tr>
                            <td style={td}>Gross Salary</td>
                            <th style={th3}>${totalsalary}</th>
                        </tr>
                    </table>
                </div>
            </div>                
        </div>
    );
} 
export default PaySlip