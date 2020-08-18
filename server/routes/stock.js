const express = require("express");
const router = express.Router();

// validators
const {
  stockCreateValidator,
  stockUpdateValidator
} = require("../validators/stock");
const { runValidation } = require("../validators/index");

//controllers
const { create, list, read, update, remove } = require("../controllers/stock");
const { requireSignin, authMiddleware } = require("../controllers/auth");

router.post(
  "/stock",
  stockCreateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  create
);

router.get("/stocks", list);

router.get("/stock/:slug", read);

router.put(
  "/stock/:slug",
  stockUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);

router.delete("/stock/:slug", requireSignin, authMiddleware, remove);

module.exports = router;
