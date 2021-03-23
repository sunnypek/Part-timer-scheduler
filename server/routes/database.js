const router = require("express-promise-router")();

const databaseController = require("../controllers/database");

router.route("/clockIn")
	.post(databaseController.clockIn);

router.route("/clockOut")
	.post(databaseController.clockOut);

router.route("/summary")
	.post(databaseController.summary);	

router.route("/payslip")
	.post(databaseController.payslip);

router.route("/admin")
	.post(databaseController.admin)
	.post(databaseController.updateOTrate);

router.route("/timeslot")
	.get(databaseController.getTimeslot)
	.post(databaseController.addTimeslot)
	.patch(databaseController.patchTimeslot)
	.delete(databaseController.deleteTimeslot);

router.route("/getEmployees")
	.get(databaseController.getEmployees);

router.route("/attendance")
	.get(databaseController.attendance);

router.route("/book")
	.post(databaseController.postBook)
	.delete(databaseController.deleteBook);
	
module.exports = router;