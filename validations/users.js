const { body } = require("express-validator");

const userValidation = () => {
	return [
		body("name")
			.notEmpty()
			.withMessage("Name is required")
			.isLength({ min: 2 })
			.withMessage("Name must greater than 2 char"),
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Please enter a valid email address"),
		body("password")
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 8 })
			.withMessage("Password must greater than 8 char"),
	];
};
module.exports = { userValidation };
