const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
var cors = require("cors");
const httpStatusText = require("./utils/httpStatusText");
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
const courseRouter = require("./routes/courses");
const usersRouter = require("./routes/users");
const port = process.env.PORT;
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
	console.log("Connected to MongoDB server Success");
});
app.use(express.json());
app.use("/api/courses", courseRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res) => {
	res.status(404).json({
		status: httpStatusText.ERROR,
		message: "Route not found",
	});
});
app.use((error, req, res, next) => {
	res.status(error.code || 500).json({
		status: error.statusText || httpStatusText.ERROR,
		message: error.message,
		code: error.code,
	});
});
app.listen(port, () => {
	console.log("Server running on port", port);
});
