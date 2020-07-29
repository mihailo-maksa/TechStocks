const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Please enter a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
];
