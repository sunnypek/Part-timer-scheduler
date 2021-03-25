const router = require("express-promise-router")();

const databaseController = require("../controllers/database");
const payrollController = require("../controllers/payroll");
const usersController = require("../controllers/user");
const bookingController = require("../controllers/booking");

router.route("/clockIn")
	.post(databaseController.clockIn);

router.route("/clockOut")
	.post(databaseController.clockOut);

router.route("/summary")
	.post(databaseController.summary);	

router.route("/payslip")
	.post(databaseController.payslip);

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
	.get(bookingController.get)
	.post(bookingController.post)
	.delete(bookingController.delete);

router.route("/payroll")
	.get(payrollController.get);

router.route("/timeslots")
	.get(usersController.get);
	
module.exports = router;