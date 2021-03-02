const db = require("../database");

module.exports = {
	clockIn: async (req, res, next) => {
		console.log("req.body is ", req.body);
		const result = await db.execute(
			"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr) VALUES (?, ?, ?, ?, ?, ?)"
			,[req.body.timeslotID, req.body.employeeName, req.body.clockIn, req.body.clockOut, req.body.normalHour, req.body.overtimeHour]
		);
		console.log("result is ", result);
		res.status(200).json({ 
			clockIn: true
		});
	},

	clockOut: async (req, res, next) => {
		res.status(200).json({
			clockOut: true
		})
	}
}