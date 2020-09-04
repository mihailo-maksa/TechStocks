const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("username").not().isEmpty().withMessage("Username is required."),
  check("email").isEmail().withMessage("Please enter a valid email address."),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  check("categories")
    .isLength({ min: 8 })
    .withMessage("Please choose at least one category of interest.")
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Please enter a valid email address."),
  check("password").exists().withMessage("Password is required.")
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Please enter a valid email address.")
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  check("resetPasswordLink").not().isEmpty().withMessage("Token is required.")
];

exports.userUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required.")
];
