const express = require("express");
const router = express.Router();

// Validation Middleware
const { runValidation } = require("../validators/index");
const { userRegisterValidator } = require("../validators/auth");

// Controller Functions
const { register } = require("../controllers/auth");

router.post("/register", userRegisterValidator, runValidation, register);

module.exports = router;
