const router = require("express-promise-router")();

const databaseController = require("../controllers/database");

router.route("/clockIn")
	.post(databaseController.clockIn);

router.route("/clockOut")
	.post(databaseController.clockOut);

router.route("/getEmployees")
	.get(databaseController.getEmployees);
	
router.get('/attendance', function(req, res, next) {
	res.locals.connection.query('select * from timeslot', function (error, results, fields) {
		if(error) throw error;
		res.send(JSON.stringify(results));
	});
});
module.exports = router;