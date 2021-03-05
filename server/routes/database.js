const router = require("express-promise-router")();

const databaseController = require("../controllers/database");

router.route("/clockIn")
	.post(databaseController.clockIn);

router.route("/clockOut")
	.post(databaseController.clockOut);

router.route("/summary")
	.post(databaseController.summary);	

router.route("/addTimeslot")
	.post(databaseController.addTimeslot);

router.route("/getEmployees")
	.get(databaseController.getEmployees);

router.route("/attendance")
	.get(databaseController.attendance);
	
module.exports = router;