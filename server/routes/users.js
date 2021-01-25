const router = require("express-promise-router")();
const passport = require("passport");

const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helper/routeHelper");
const usersController = require("../controllers/user");

router.route("/signup")
	.post(validateBody(schemas.authSchema), usersController.signup);

router.route("/login")
	.post(validateBody(schemas.authSchema), passport.authenticate("local", { session: false }), usersController.login);

module.exports = router;