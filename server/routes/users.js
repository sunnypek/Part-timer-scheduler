const router = require("express-promise-router")();
const passport = require("passport");

const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helper/routeHelper");
const usersController = require("../controllers/user");

// Add the db into user
const db= require('../database');

router.route("/signup")
	.post(validateBody(schemas.authSchema), usersController.signup);

router.route("/login")
	.post(validateBody(schemas.authSchema), passport.authenticate("local", { session: false }), usersController.login);


// use postman  GET REQUEST localhost:1337/users/test 
router.get('/test',async (req,res) => {

	
		try{
			//return an array
			const result = await db.promise().query('SELECT * FROM userinfo')
			//get the first record in database 
			console.log(result[0])
			res.status(201).send({msg:'Success'})
		} catch(err) {

			console.log(err)

		


	}

});

module.exports = router;