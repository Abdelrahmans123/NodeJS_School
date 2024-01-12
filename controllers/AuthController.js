const User = require("../Models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const generateJWT = require("../utils/generateJWT");

const registerUser = asyncWrapper(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = AppError.handleError(
			errors.array(),
			400,
			httpStatusText.ERROR
		);
		return next(error);
	}
	const oldUser = await User.findOne({ email: req.body.email });
	if (oldUser) {
		const error = AppError.handleError(
			"User already exists",
			409,
			httpStatusText.FAIL
		);
		return next(error);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({
		name,
		email,
		password: hashedPassword,
		role,
		avatar: req.file.filename,
	});

	const token = await generateJWT({
		id: newUser._id,
		email: newUser.email,
		role: newUser.role,
	});
	newUser.token = token;
	await newUser.save();
	res.status(201).json({
		status: httpStatusText.SUCCESS,
		data: { user: newUser },
	});
});
const loginUser = asyncWrapper(async (req, res, next) => {
	const errors = validationResult(req);
	const { email, password } = req.body;
	if (!errors.isEmpty()) {
		const error = AppError.handleError(
			errors.array(),
			400,
			httpStatusText.ERROR
		);
		return next(error);
	}
	const user = await User.findOne({ email: email });
	if (!user) {
		const error = AppError.handleError(
			"User not Found",
			409,
			httpStatusText.FAIL
		);
		return next(error);
	}
	const matchedPassword = await bcrypt.compare(password, user.password);
	if (!matchedPassword) {
		const error = AppError.handleError(
			"Password does not match",
			400,
			httpStatusText.FAIL
		);
		return next(error);
	}
	if (user && matchedPassword) {
		const token = await generateJWT({
			email: user.email,
			id: user._id,
			role: user.role,
		});
		return res.status(200).json({
			status: httpStatusText.SUCCESS,
			data: { token },
		});
	} else {
		const error = AppError.handleError(
			"User not Found",
			409,
			httpStatusText.FAIL
		);
		return next(error);
	}
});
module.exports = {
	registerUser,
	loginUser,
};
