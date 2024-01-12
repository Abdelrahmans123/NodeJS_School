const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
module.exports = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.currentUser.role)) {
			const error = appError.handleError(
				"User not allowed to access this page due to invalid role",
				401,
				httpStatusText.ERROR
			);
			return next(error);
		}
		next();
	};
};
