const Joi = require("joi");

module.exports = {
	validateBody: (schema) => {
		return (req, res, next) => {
			const validate = schema.validate(req.body);
			if (validate.error) {
				return res.status(400).json(validate.error);
			}
			if (!req.value) {
				req.value = {}
			}
			req.value["body"] = validate.value;
			next();
		}
	},

	schemas: {
		authSchema: Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).max(18).required(),
			authLevel: Joi.string()
		})
	}
}