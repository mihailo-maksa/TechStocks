const express = require("express");
const router = express.Router();

// Validation Middleware
const { runValidation } = require("../validators/index");
const {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require("../validators/auth");

// Controller Functions
const {
  register,
  registerActivate,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

router.post("/register", userRegisterValidator, runValidation, register);

router.post("/register/activate", registerActivate);

router.post("/login", userLoginValidator, runValidation, login);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
