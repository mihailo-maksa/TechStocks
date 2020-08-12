const express = require("express");
const router = express.Router();

// import middlewares
const {
  requireSignin,
  adminMiddleware,
  authMiddleware
} = require("../controllers/auth");

// import controller functions
const { read } = require("../controllers/user");

router.get("/user", requireSignin, authMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);

module.exports = router;
