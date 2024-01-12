const { body } = require("express-validator")

const courseValidation=() => {
    return [
        body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must greater than 2 char")
    ]
}
module.exports ={courseValidation};