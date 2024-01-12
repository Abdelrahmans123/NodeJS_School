const express = require("express");
const UserController = require("../controllers/UserController");
const { userValidation } = require("../validations/users");
const AuthController = require("../controllers/AuthController");
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowTo");
const userRoles = require("../utils/userRoles");
const multer = require("multer");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		const fileName = `user-${Date.now()}.${ext}`;
		cb(null, fileName);
	},
});
const fileFilter = (req, file, cb) => {
	const fileType = file.mimetype.split("/")[0];
	if (fileType === "image") {
		return cb(null, true);
	} else {
		const error = appError.handleError(
			"File must be an image",
			400,
			httpStatusText.FAIL
		);
		return cb(error, false);
	}
};

const upload = multer({ storage: diskStorage, fileFilter });
const router = express.Router();
router.route("/").get(verifyToken, UserController.getAllUsers);

router
	.route("/:userId")
	.get(verifyToken, UserController.getUsersById)
	.patch(
		verifyToken,
		allowTo(userRoles.ADMIN),
		userValidation(),
		UserController.updateUsers
	)
	.delete(verifyToken, allowTo(userRoles.ADMIN), UserController.deleteUsers);

router
	.route("/register")
	.post(
		upload.single("avatar"),
		userValidation(),
		AuthController.registerUser
	);
router.route("/login").post(AuthController.loginUser);
module.exports = router;
