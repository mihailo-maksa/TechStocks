const express = require("express");
const router = express.Router();

// import validators
const { userUpdateValidator } = require("../validators/auth");
const { runValidation } = require("../validators/index.js");

// import middlewares
const {
  requireSignin,
  adminMiddleware,
  authMiddleware
} = require("../controllers/auth");

// import controller functions
const { read, update } = require("../controllers/user");

router.get("/user", requireSignin, authMiddleware, read);

router.get("/admin", requireSignin, adminMiddleware, read);

router.put(
  "/user",
  userUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);

module.exports = router;
