const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const verifyToken = (req, res, next) => {
	const authHeader =
		req.headers["Authorization"] || req.headers["authorization"];
	if (!authHeader) {
		const error = appError.handleError(
			"Token Required",
			401,
			httpStatusText.FAIL
		);
		return next(error);
	}
	const token = authHeader.split(" ")[1];
	try {
		const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.currentUser = currentUser;
		next();
	} catch (err) {
		const error = appError.handleError(
			"Invalid token",
			401,
			httpStatusText.ERROR
		);
		return next(error);
	}
};
module.exports = verifyToken;
