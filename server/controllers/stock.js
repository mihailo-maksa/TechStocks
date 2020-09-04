const Stock = require("../models/Stock");
const User = require("../models/User");
const Category = require("../models/Category");
const slugify = require("slugify");
const AWS = require("aws-sdk");
const { stockPublishedParams } = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.create = async (req, res) => {
  const { name, url, categories, type, rating, ticker, description } = req.body;

  const slug = slugify(name);
  let stock = new Stock({
    name,
    slug,
    url,
    type,
    categories,
    rating,
    ticker,
    description
  });
  stock.postedBy = req.user._id;

  try {
    await stock.save(async (err, data) => {
      if (err) {
        return res.status("400").json({ erorr: "Stock already exists." });
      }

      res.json(data);

      // find all users with favorite category
      try {
        const foundUsers = await User.find({ categories: { $in: categories } });

        if (!foundUsers) {
          throw new Error("Stock published email error!");
        }

        const foundCategories = await Category.find({
          _id: { $in: categories }
        });

        data.categories = foundCategories;

        for (let i = 0; i < foundUsers.length; i++) {
          const params = stockPublishedParams(foundUsers[i].email, data);

          const emailData = await ses.sendEmail(params).promise();

          console.log(
            `Stock published email no. ${i + 1} was sent to ${
              foundUsers[i].email
            }: EMAIL DATA - ${emailData}`
          );
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.list = async (req, res) => {
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;

  try {
    const stocks = await Stock.find({})
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!stocks) {
      return res.status(400).json({ error: "Couldn't list stocks." });
    }

    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.read = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findOne({ _id: id })
      .populate("postedBy", "_id name username")
      .populate("categories", "name");

    if (!stock) {
      return res.status(400).json({ error: "Couldn't find stock." });
    }

    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.update = async (req, res) => {
  const { name, url, categories, type, rating, ticker, description } = req.body;
  const { id } = req.params;

  try {
    const updatedStock = await Stock.findOneAndUpdate(
      { _id: id },
      { name, url, categories, type, rating, ticker, description },
      { upsert: true, new: true }
    );

    if (!updatedStock) {
      return res.status(400).json({
        error: "Could not update stock."
      });
    }

    res.json(updatedStock);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findOneAndRemove({ _id: id });

    if (!stock) {
      return res.status(400).json({
        error: "Could not delete stock."
      });
    }

    res.status(200).json({
      message: "Stock deleted successfully."
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.clickCount = async (req, res) => {
  const { stockId } = req.body;

  try {
    let stock = await Stock.findById(stockId);

    if (stock.clicks.some((click) => click.user.toString() === req.user._id)) {
      return res
        .status(400)
        .json({ error: "Only one click is counted per user." });
    }

    stock.clicks.unshift({ user: req.user._id });

    await stock.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: "Couldn't update click count." });
      }

      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.rateStock = async (req, res) => {
  const { rate, stockId } = req.body;

  try {
    let stock = await Stock.findById(stockId);

    if (
      stock.ratings.some((rating) => rating.user.toString() === req.user._id)
    ) {
      return res.status(400).json({ error: "You already rated this stock." });
    }

    stock.ratings.unshift({ user: req.user._id, rate: rate });

    stock.bullishRatings = stock.ratings.filter(
      (rating) => rating.rate === "Bullish"
    ).length;

    stock.bearishRatings = stock.ratings.filter(
      (rating) => rating.rate === "Bearish"
    ).length;

    await stock.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: "Couldn't add stock rating." });
      }

      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};
