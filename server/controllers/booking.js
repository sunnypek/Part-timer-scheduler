const db = require("../database");

module.exports = {
    get: async (req, res, next) => {
        
    },
    post: async (req, res, next) => {
		try {
			const result = await db.promise().query(
				"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name) VALUES (?, ?)",
				[req.body.Timeslot_ID, req.body.Employee_Name]
			);
			res.status(200).json({ alreadybooked: false });	
		} catch (error) {
			console.error(error.sqlMessage);
			res.status(200).json({ alreadybooked: true });
		}
	},

	delete: async (req, res, next) => {
		const result = await db.promise().query(
			"DELETE FROM bookingdetail WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.query.timeslotID, req.query.employeeName]
		);
		res.status(200).json(result);
	},
}