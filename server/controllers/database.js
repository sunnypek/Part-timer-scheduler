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
	}
}