const db = require("../database");

module.exports = {
	clockIn: (req, res, next) => {
		db.execute(
			"UPDATE bookingdetail SET Clock_In = ? WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.body.clockIn, req.body.timeslotID, req.body.employeeName],
			//"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr) VALUES (?, ?, ?, ?, ?, ?)",
			//[req.body.timeslotID, req.body.employeeName, req.body.clockIn, null, req.body.normalHour, req.body.overtimeHour],
			(err, results, fields) => {
				if (err) {
					res.status(400).json({ err });
				} else {
					// res.status(200).json({ 
					// 	timeslotID: req.body.timeslotID,
					// 	employeeName: req.body.employeeName,
					// 	clockIn: req.body.clockIn,
					// 	clockOut: null,
					// 	normalHour: null,
					// 	overtimeHour: null
					// });
					res.status(200).json({
						success: true,
						employeeName: employeeName,
						timeslotDetails: timeslotDetails[0],
					});
				}
			}
		);
	},
  
  clockOut: (req, res, next) => {
		db.execute(
			"UPDATE bookingdetail SET Clock_Out = ? WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.body.clockOut, req.body.timeslotID, req.body.employeeName],
			(err, results, fields) => {
				if (err) {
					res.status(400).json({ err });
				} else {
					res.status(200).json({
						clockOut: req.body.clockOut,
						timeslotID: req.body.timeslotID,
						employeeName: req.body.employeeName		
					});
				}
			}
		);
	},

	getTimeslotID: (req, res, next) => {
		db.execute(
			"SELECT * FROM bookingdetail", 
			(err, results, fields) => {
				err ? res.status(400).json({ err }) : res.status(200).json({ results });
			}
		);
	},

	getEmployees: (req, res, next) => {
		db.execute(
			"SELECT * FROM userinfo", 
			(err, results, fields) => {
				err ? res.status(400).json({ err }) : res.status(200).json({ results });
			}
		);
	},

	attendance: (req, res, next) => {
		db.execute(
			"SELECT Timeslot_ID, Clock_IN, Clock_OUT, Normal_hr, OverTime_hr FROM bookingdetail", 
			(err, results, fields) => {
				err ? res.status(400).json({ err }) : res.status(200).json({ results });
			}
		);
	},
	
	getTimeslot: (req, res, next) => {
		db.execute(
			"SELECT TimeSlot_ID as title, Start_DateTime as start, End_DateTime as end, Normal_Rate as normalRate, OT_Rate as overtimeRate FROM timeslot",
			(err, results, fields) => {
				if (err) {
					res.status(400).json(err);
				} else {
					res.status(200).json(results);
				}
			}
		);
	},

	addTimeslot: (req, res, next) => {
		db.execute(
			"INSERT INTO timeslot (TimeSlot_ID, Start_DateTime, End_DateTime, Create_By, Normal_Rate, OT_Rate) VALUES (?, ?, ?, ?, ?, ?)",
			[req.body.TimeSlot_ID, req.body.Start_DateTime, req.body.End_DateTime, req.body.Create_By, req.body.Normal_Rate, req.body.OT_Rate],
			(err, results, fields) => {
				if (err) {
					res.status(400).json({ err });
				} else {
					res.status(200).json(results);
				}
			}
		);
  },

	patchTimeslot: async (req, res, next) => {
		console.log(req.body);
		let set = " ";
		for (const [key, value] of Object.entries(req.body)) {
				if (key === "TimeSlot_ID") continue;
				set += key + " = '" + value + "', ";
		}
		const result = await db.promise().query(
				"UPDATE timeslot SET " + set.slice(0, -2) + " WHERE TimeSlot_ID = ?",
				[req.body.TimeSlot_ID]
		);
		res.status(200).json(result);
	},

	deleteTimeslot: async (req, res, next) => {
		const result = await db.promise().query(
			"DELETE FROM timeslot WHERE TimeSlot_ID = ?",
			[req.query.timeslotID]
		);
		res.status(200).json(result);
	},

	postBook: async (req, res, next) => {
		try {
			const result = await db.promise().query(
				"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name) VALUES (?, ?)",
				[req.body.Timeslot_ID, req.body.Employee_Name]
			);
			res.status(200).json(result);	
		} catch (error) {
			console.error(error.sqlMessage);
			res.status(500);
		}
	},

	deleteBook: async (req, res, next) => {
		const result = await db.promise().query(
			"DELETE FROM bookingdetail WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.query.timeslotID, req.query.employeeName]
		);
		res.status(200).json(result);
	},

	admin:  async (req, res, next) => {
		console.log(req.body);
		const employeeNameQuery = await db.promise().query(`SELECT * FROM userinfo WHERE Employee_Name = "${req.body.currentEmp}"`);
		const employeeName = req.body.currentEmp;

		const bookingDetails = await db.promise().query(`
			SELECT *
			FROM bookingdetail 
			WHERE Employee_Name = "${req.body.currentEmp}"
			AND Timeslot_ID IN (
				SELECT Timeslot_ID
				FROM timeslot
				WHERE YEAR(Start_DateTime) = ${req.body.year}
				AND MONTH(Start_DateTime) = ${req.body.month}
				AND TimeSlot_ID IN (
					SELECT TimeSlot_ID 
					FROM bookingdetail
					WHERE Employee_Name = "${req.body.currentEmp}"
				)
			)
			ORDER BY Clock_IN DESC
		`);

		const payRate = await db.promise().query(`
			SELECT *
			FROM timeslot
			WHERE YEAR(Start_DateTime) = ${req.body.year} 
			AND TimeSlot_ID IN (
				SELECT TimeSlot_ID 
				FROM bookingdetail
				WHERE Employee_Name = "${req.body.currentEmp}"
			)
			ORDER BY Start_DateTime DESC
		`);

		const hoursWorked = await db.promise().query(`
			SELECT COALESCE(sum(diff_hours), 0) as diff_hours, COALESCE(sum(diff_minute), 0) as diff_minute FROM(
			SELECT *,
			MOD(HOUR(TIMEDIFF(Clock_IN, Clock_OUT)), 24) as diff_hours,
			MINUTE(TIMEDIFF(Clock_IN, Clock_OUT)) as diff_minute
			FROM bookingdetail
			WHERE Employee_Name = "?"
			AND YEAR(Clock_IN) = ${req.body.year}
			) as tb`
		);

 		/* const getTimeslot = await db.promise().query(`
			SELECT * FROM timeslot WHERE TimeSlot_ID = ${req.body.currentTimeslot};
		`);  */

		/* const createUser = await db.promise().query(`
			INSERT INTO userinfo (Email, Employee_Name, Employer_Name) VALUES (${req.body.email}, ${req.body.name}, ${req.body.name})`
		);  */

		var databaseError = false;
		if(employeeNameQuery[0].length == 0) databaseError = true;

		res.status(200).json({	
			success: true,
			employeeName: employeeName,
			databaseError: databaseError,
			bookingDetails: bookingDetails[0],
			payRate: payRate[0],
			hoursWorked: hoursWorked[0][0],
			/* getTimeslot: getTimeslot[0], */
			/* createUser: createUser[0], */
		});
	},

	updateOTrate: (req, res, next) => {
		db.execute(
			"UPDATE timeslot SET OT_Rate = ? WHERE Employee_Name = ?",
			[req.body.otRate, req.body.employeeName],
			(err, results, fields) => {
				if (err) {
					res.status(400).json({ err });
				} else {
					res.status(200).json({
						otRate: req.body.otRate,
						employeeName: req.body.employeeName		
					});
				}
			}
		);
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
			ORDER BY Clock_IN DESC
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
			ORDER BY Start_DateTime DESC
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

		const monthEarnings = await db.promise().query(`
			SELECT
			SUM(bookingdetail.Normal_hr * timeslot.Normal_Rate + bookingdetail.OverTime_hr * timeslot.OT_Rate) as earnings,
			month(timeslot.Start_DateTime) as mth
			FROM bookingdetail
			INNER JOIN timeslot ON bookingdetail.Timeslot_ID = timeslot.Timeslot_ID
			WHERE bookingdetail.Employee_Name = "${employeeName}"
			AND YEAR(timeslot.Start_DateTime) = ${req.body.year}
			GROUP BY month(timeslot.Start_DateTime)`
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
			monthEarnings : monthEarnings[0],
		});
	},

	payslip: async (req, res, next) => {
		console.log(req.body);

		// Get userinfo using username
		const employeeNameQuery = await db.promise().query(`SELECT * FROM userinfo WHERE Employee_Name = "${req.body.username}"`);
		const employeeName = req.body.username;

		const payslipbookingDetails = await db.promise().query(`
			SELECT *
			FROM bookingdetail 
			WHERE Employee_Name = "${employeeName}"
			AND Timeslot_ID IN (
				SELECT Timeslot_ID
				FROM timeslot
				WHERE YEAR(Start_DateTime) = ${req.body.year}
				AND MONTH(Start_DateTime) = ${req.body.month}
				AND TimeSlot_ID IN (
					SELECT TimeSlot_ID 
					FROM bookingdetail
					WHERE Employee_Name = "${employeeName}"
				)
			)
			ORDER BY Clock_IN DESC
		`);

		const paysliptimeslotDetails = await db.promise().query(`
			SELECT *
			FROM timeslot
			WHERE YEAR(Start_DateTime) = ${req.body.year}
			AND MONTH(Start_DateTime) = ${req.body.month}
			AND TimeSlot_ID IN (
				SELECT TimeSlot_ID 
				FROM bookingdetail
				WHERE Employee_Name = "${employeeName}"
			)
			ORDER BY Start_DateTime DESC
		`);

		var databaseError = false;
		if(employeeNameQuery[0].length == 0 || paysliptimeslotDetails[0].length == 0) databaseError = true;

		res.status(200).json({
			success: true,
			employeeName: employeeName,
			databaseError: databaseError,
			payslipbookingDetails: payslipbookingDetails[0],
			paysliptimeslotDetails: paysliptimeslotDetails[0],
		});
	},
}