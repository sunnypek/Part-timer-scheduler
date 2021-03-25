const db = require("../database");

module.exports = {
    get: async (req, res, next) => {
        console.log(req.query);
        await db.promise().query(
            `SELECT * FROM bookingdetail WHERE Timeslot_ID = '${req.query.timeslotID}' AND Employee_Name != '${req.query.username}'`
        ).then((result) => {
            res.status(200).json(result[0]);
        }).catch(() => {
            res.status(500).json({ none: true });
        });
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