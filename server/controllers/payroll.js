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
        }
        const compareStart = req.query.year + "-" + dbMonth + "-01";
        const compareEnd = req.query.year + "-" + dbMonth + "-31";
        const result = await db.promise().query(
			"SELECT Normal_hr as norm, OverTime_hr as OT FROM bookingdetail " + 
            "WHERE Employee_Name = ? " + 
            "AND Clock_IN BETWEEN CAST(? as date) AND CAST(? as date) " + 
            "AND Clock_OUT BETWEEN CAST(? as date) AND CAST(? as date)",
			[req.query.employeeName, compareStart, compareEnd, compareStart, compareEnd]
		);
        let norm = 0, OT = 0;
        result[0].forEach(value => {
            norm += value.norm;
            OT += value.OT;
        });
		res.status(200).json({ norm, OT });
    },
}