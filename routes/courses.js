const express = require("express");
const courseController = require("../controllers/CourseController");
const { courseValidation } = require("../validations/courses");
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowTo = require("../middlewares/allowTo");
const router = express.Router();
router
	.route("/")
	.get(verifyToken, courseController.getCourses)
	.post(
		courseValidation(),
		allowTo(userRoles.ADMIN),
		courseController.createCourse
	);

router
	.route("/:courseId")
	.get(verifyToken, courseController.getCoursesById)
	.patch(
		verifyToken,
		allowTo(userRoles.ADMIN),
		courseValidation(),
		courseController.updateCourse
	)
	.delete(
		verifyToken,
		allowTo(userRoles.ADMIN),
		courseController.deleteCourse
	);

module.exports = router;
