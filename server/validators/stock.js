const { check } = require("express-validator");

exports.stockCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required."),
  check("ticker").not().isEmpty().withMessage("Ticker symbol is required."),
  check("description")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long."),
  check("url").not().isEmpty().withMessage("URL is required."),
  check("categories")
    .not()
    .isEmpty()
    .withMessage("Pick at least one category."),
  check("type").not().isEmpty().withMessage("Please choose a stock type."),
  check("rating").not().isEmpty().withMessage("Please choose your rating.")
];

exports.stockUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required."),
  check("ticker").not().isEmpty().withMessage("Ticker symbol is required."),
  check("description")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long."),
  check("url").not().isEmpty().withMessage("URL is required."),
  check("categories")
    .not()
    .isEmpty()
    .withMessage("Pick at least one category."),
  check("type").not().isEmpty().withMessage("Please choose a stock type."),
  check("rating").not().isEmpty().withMessage("Please choose your rating.")
];
