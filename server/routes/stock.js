const express = require("express");
const router = express.Router();

// validators
const {
  stockCreateValidator,
  stockUpdateValidator
} = require("../validators/stock");
const { runValidation } = require("../validators/index");

//controllers
const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  rateStock
} = require("../controllers/stock");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteStock
} = require("../controllers/auth");

router.post(
  "/stock",
  stockCreateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  create
);

router.post("/stocks", requireSignin, adminMiddleware, list);

router.put("/click-count", requireSignin, authMiddleware, clickCount);

router.put("/rate-stock", requireSignin, authMiddleware, rateStock);

router.get("/stock/:id", read);

router.put(
  "/stock/:id",
  stockUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  canUpdateDeleteStock,
  update
);

router.put(
  "/stock/admin/:id",
  stockUpdateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  update
);

router.delete(
  "/stock/:id",
  requireSignin,
  authMiddleware,
  canUpdateDeleteStock,
  remove
);

router.delete("/stock/admin/:id", requireSignin, adminMiddleware, remove);

module.exports = router;
