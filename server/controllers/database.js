const db = require("../database");

module.exports = {
	clockIn: (req, res, next) => {
		db.execute(
			"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr) VALUES (?, ?, ?, ?, ?, ?)"
			,[req.body.timeslotID, req.body.employeeName, req.body.clockIn, null, req.body.normalHour, req.body.overtimeHour]
		);
		res.status(200).json({ 
			timeslotID: req.body.timeslotID,
			employeeName: req.body.employeeName,
			clockIn: req.body.clockIn,
			clockOut: null,
			normalHour: req.body.normalHour,
			overtimeHour: req.body.overtimeHour
		});
	},

	clockOut: (req, res, next) => {
		db.execute(
			"UPDATE bookingdetail SET Clock_Out = ? WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.body.clockOut, req.body.timeslotID, XMLHttpRequestEventTarget.body.employeeName]
		);
		res.status(200).json({
			clockOut: req.body.clockOut,
			timeslotID: req.body.timeslotID,
			employeeName: req.body.employeeName		
		});
	},

	getEmployees: (req, res, next) => {
		db.execute(
			"SELECT * FROM userinfo", 
			(err, results, fields) => {
				err ? console.error(err) : res.status(200).json({ results });
			}
		);
	},

	attendance: (req, res, next) => {
		db.execute(
			"SELECT Timeslot_ID, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr FROM bookingdetail", 
			(err, results, fields) => {
				err ? console.error(err) : res.status(200).json({ results });
			}
		);
	},


}