import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

function Chart(props) {
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var gridLineColor = [];

    if(props.currentYear)
        gridLineColor[props.month] = "red";

    const state = {
        dataLine: {
            labels: monthList,
            datasets: [
            {
                label: "earnings in $",
                fill: true,
                lineTension: 0.3,
                backgroundColor: "rgba(225, 204,230, .3)",
                borderColor: "rgb(205, 130, 158)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgb(205, 130,1 58)",
                pointBackgroundColor: "rgb(255, 255, 255)",
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(0, 0, 0)",
                pointHoverBorderColor: "rgba(220, 220, 220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: props.earnings
            }]
        },
        options: { 
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            if(value === monthList[props.month]) {
                                return value + "(Current)";
                            }
                            return value;
                        }
                    },
                    gridLines: {
                        color: gridLineColor
                    }
                }]
            }
        },
        responsive: true
    }
    return (
        <MDBContainer>
            <Line data={state.dataLine} options={state.options} />
        </MDBContainer>
    )
}

export default Chart;