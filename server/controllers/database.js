const db = require("../database");

module.exports = {
	clockIn: async (req, res, next) => {
		console.log("req.body is ", req.body);
		const result = await db.execute(
			"INSERT INTO timeslot (TimeSlot_ID, Start_DateTime, End_DateTime, Normal_Rate, OT_Rate) VALUES (?, ?, ?, ?, ?)"
			,[req.body.timeSlotID, req.body.startDateTime, req.body.endDateTime, req.body.normalRate, req.body.OTRate]
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
	},

	summary: async (req, res, next) => {
		console.log(req.body);

		// Get userinfo using email
		// const employeeNameQuery = await db.promise().query(`SELECT * FROM userinfo WHERE Email = "${req.body.email}"`);
		// const employeeName = employeeNameQuery[0][0]["Employee_Name"];

		// Get userinfo using username
		const employeeNameQuery = await db.promise().query(`SELECT * FROM userinfo WHERE Employee_Name = "${req.body.username}"`);
		const employeeName = req.body.username;

		const bookingDetails = await db.promise().query(`
			SELECT *, TIMEDIFF(Clock_IN, Clock_OUT) as time_diff 
			FROM bookingdetail 
			WHERE Employee_Name = "${employeeName}"
			AND Timeslot_ID IN (
				SELECT Timeslot_ID
				FROM timeslot
				WHERE YEAR(Start_DateTime) = ${req.body.year}
				AND TimeSlot_ID IN (
					SELECT TimeSlot_ID 
					FROM bookingdetail
					WHERE Employee_Name = "${employeeName}"
				)
			)
		`);

		const timeslotDetails = await db.promise().query(`
			SELECT *,
			DAYOFWEEK(Start_DateTime) as day_of_week 
			FROM timeslot
			WHERE YEAR(Start_DateTime) = ${req.body.year}
			AND TimeSlot_ID IN (
				SELECT TimeSlot_ID 
				FROM bookingdetail
				WHERE Employee_Name = "${employeeName}"
			)
		`);

		const daysWorked = await db.promise().query(`
			SELECT COUNT(DISTINCT DATE(CLOCK_IN)) as diff_days
			FROM bookingdetail
			WHERE Employee_Name = "${employeeName}"
			AND YEAR(Clock_IN) = ${req.body.year}
		`);

		const hoursWorked = await db.promise().query(`
			SELECT COALESCE(sum(diff_hours), 0) as diff_hours, COALESCE(sum(diff_minute), 0) as diff_minute FROM(
			SELECT *,
			MOD(HOUR(TIMEDIFF(Clock_IN, Clock_OUT)), 24) as diff_hours,
			MINUTE(TIMEDIFF(Clock_IN, Clock_OUT)) as diff_minute
			FROM bookingdetail
			WHERE Employee_Name = "${employeeName}"
			AND YEAR(Clock_IN) = ${req.body.year}
			) as tb`
		);

		var databaseError = false;
		if(employeeNameQuery[0].length == 0 || timeslotDetails[0].length == 0) databaseError = true;

		res.status(200).json({
			success: true,
			employeeName: employeeName,
			databaseError: databaseError,
			bookingDetails: bookingDetails[0],
			daysWorked: daysWorked[0][0]["diff_days"],
			hoursWorked: hoursWorked[0][0],
			timeslotDetails: timeslotDetails[0],
		})
	}
}