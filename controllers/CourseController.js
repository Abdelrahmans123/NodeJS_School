// let {courses}=require('../data/courses');
const Course = require("../Models/Course");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/appError");

const getCourses = asyncWrapper(async (req, res) => {
	const query = req.query;
	const limit = query.limit || 10;
	const page = query.page || 1;
	const skip = (page - 1) * limit;
	const courses = await Course.find({}, { __v: false })
		.limit(limit)
		.skip(skip);
	res.json({
		status: httpStatusText.SUCCESS,
		data: { courses },
	});
});
const getCoursesById = asyncWrapper(async (req, res, next) => {
	const course = await Course.findById(req.params.courseId);
	if (!course) {
		const error = AppError.handleError(
			"Course not found",
			404,
			httpStatusText.FAIL
		);
		return next(error);
	}
	return res.json({
		status: httpStatusText.SUCCESS,
		data: { course },
	});
});

const createCourse = asyncWrapper(async (req, res, next) => {
	const courseBody = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = AppError.handleError(
			errors.array(),
			400,
			httpStatusText.ERROR
		);
		return next(error);
	}
	const newCourse = new Course(courseBody);
	await newCourse.save();
	res.status(201).json({
		status: httpStatusText.SUCCESS,
		data: { course: newCourse },
	});
});

const updateCourse = asyncWrapper(async (req, res, next) => {
	const courseId = req.params.courseId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = AppError.handleError(
			errors.array(),
			400,
			httpStatusText.ERROR
		);
		return next(error);
	}
	let course = await Course.findByIdAndUpdate(courseId, {
		$set: { ...req.body },
	});
	if (!course) {
		const error = AppError.handleError(
			"Course not found",
			404,
			httpStatusText.FAIL
		);
		return next(error);
	}
	return res.status(200).json({
		status: httpStatusText.SUCCESS,
		data: { course },
	});
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
	const courseId = req.params.courseId;
	const course = await Course.findByIdAndDelete(courseId);
	if (!course) {
		const error = AppError.handleError(
			"Course not found",
			404,
			httpStatusText.FAIL
		);
		return next(error);
	}
	res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
	getCourses,
	getCoursesById,
	createCourse,
	updateCourse,
	deleteCourse,
};
