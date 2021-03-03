const db = require("../database");

module.exports = {
	clockIn: async (req, res, next) => {
		console.log("req.body is ", req.body);
		const result = await db.execute(
			"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr) VALUES (?, ?, ?, ?, ?, ?)"
			,[req.body.timeslotID, req.body.employeeName, req.body.clockIn, null, req.body.normalHour, req.body.overtimeHour]
		);
		console.log("result is ", result);
		res.status(200).json({ 
			timeslotID: req.body.timeslotID,
			employeeName: req.body.employeeName,
			clockIn: req.body.clockIn,
			clockOut: null,
			normalHour: req.body.normalHour || 0,
			overtimeHour: req.body.overtimeHour || 0
		});
	},

	clockOut: async (req, res, next) => {
		const result = await db.execute(
			"UPDATE bookingdetail SET Clock_Out = ?",
			[req.body.clockOut]
		);
		console.log("result is ", result);
		res.status(200).json({
			clockOut: req.body.clockOut		
		});
	},

	getEmployees: async (req, res, next) => {
		await db.execute(
			"SELECT * FROM userinfo", 
			(err, results, fields) => {
				if (err) {
					console.error(err);
				} else {
					res.status(200).json({ results });
				}
			}
		);
	}
}