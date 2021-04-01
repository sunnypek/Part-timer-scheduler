const db = require("../database");

module.exports = {
    get: async (req, res, next) => {
        await db.promise().query(
            `SELECT * FROM bookingdetail WHERE Timeslot_ID = '${req.query.timeslotID}'`
        ).then((result) => {
            res.status(200).json(result[0]);
        }).catch(() => {
            res.status(500).json({ none: true });
        });
    },

    post: async (req, res, next) => {
		await db.promise().query(
			`SELECT need from timeslot WHERE TimeSlot_ID = '${req.body.Timeslot_ID}'`
		).then(async needResult => {
			let need = parseInt(needResult[0][0].need);
			if (need === 0) {
				res.status(200).json({ alreadyFull: true })
			} else {
				await db.promise().query(
					"INSERT INTO bookingdetail (Timeslot_ID, Employee_Name) VALUES (?, ?)",
					[req.body.Timeslot_ID, req.body.Employee_Name]
				).then(async () => {
					await db.promise().query(
						`UPDATE timeslot SET need = '${need - 1}' WHERE TimeSlot_ID = '${req.body.Timeslot_ID}'`
					).then(() => {
						res.status(200).json({ alreadybooked: false });
					});
				}).catch(() => {
					res.status(200).json({ alreadybooked: true });
				});
			};
		});
	},

	delete: async (req, res, next) => {
		const result = await db.promise().query(
			"DELETE FROM bookingdetail WHERE Timeslot_ID = ? AND Employee_Name = ?",
			[req.query.timeslotID, req.query.employeeName]
		);
		res.status(200).json(result);
	},
}