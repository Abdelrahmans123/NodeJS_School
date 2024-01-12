const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/appError");
const getAllUsers = asyncWrapper(async (req, res) => {
	const users = await User.find({}, { __v: false, password: false });
	res.json({
		status: httpStatusText.SUCCESS,
		data: { users },
	});
});
const getUsersById = asyncWrapper(async (req, res) => {
	const userId = req.params.userId;
	const user = await User.findById(userId, { __v: false, password: false });
	if (!user) {
		const error = AppError.handleError(
			"User not found",
			404,
			httpStatusText.FAIL
		);
		return next(error);
	}
	return res.json({
		status: httpStatusText.SUCCESS,
		data: { user },
	});
});
const updateUsers = asyncWrapper(async (req, res, next) => {
	const userId = req.params.userId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = AppError.handleError(
			errors.array(),
			400,
			httpStatusText.ERROR
		);
		return next(error);
	}

	try {
		const user = await User.findById(userId);
		if (!user) {
			const error = AppError.handleError(
				"User not found",
				404,
				httpStatusText.FAIL
			);
			return next(error);
		}

		// Check if the user is updating their email
		if (req.body.email && req.body.email !== user.email) {
			const existingUserWithEmail = await User.findOne({
				email: req.body.email,
			});

			// If another user has the updated email, throw an error
			if (
				existingUserWithEmail &&
				existingUserWithEmail._id.toString() !== userId
			) {
				const error = AppError.handleError(
					"Email already exists",
					400,
					httpStatusText.FAIL
				);
				return next(error);
			}
		}

		// Proceed with the update
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				...req.body,
				password: hashedPassword,
			},
			{ new: true }
		);

		return res.json({
			status: httpStatusText.SUCCESS,
			data: { updatedUser },
		});
	} catch (error) {
		return next(error);
	}
});

const deleteUsers = asyncWrapper(async (req, res) => {
	const userId = req.params.userId;
	await User.findByIdAndDelete(userId);
	res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
	getAllUsers,
	getUsersById,
	updateUsers,
	deleteUsers,
};
