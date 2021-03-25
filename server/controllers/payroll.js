const db = require("../database");

module.exports = {
    get: async (req, res, next) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthInNum = months.indexOf(req.query.period) + 1;
        let dbMonth;
        if (monthInNum < 10) {
            dbMonth = "0" + monthInNum.toString();
        } else {
            dbMonth = monthInNum.toString();
        };
        const result = await db.promise().query(
			"SELECT Normal_hr as norm, OverTime_hr as OT FROM bookingdetail " + 
            "WHERE Employee_Name = ? " + 
            "AND YEAR(Clock_IN) = ? AND MONTH(Clock_IN) = ? " + 
            "AND YEAR(Clock_OUT) = ? AND MONTH(Clock_OUT) = ?",
			[req.query.employeeName, req.query.year, dbMonth, req.query.year, dbMonth]
		);
        let norm = 0, OT = 0;
        result[0].forEach(value => {
            norm += value.norm;
            OT += value.OT;
        });
		res.status(200).json({ norm, OT });
    },
}