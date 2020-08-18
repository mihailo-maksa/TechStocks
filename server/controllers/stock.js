const Stock = require("../models/Stock");
const slugify = require("slugify");

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

  let arrayOfCategories = categories && categories.split(",");
  stock.categories = arrayOfCategories;

  try {
    await stock.save((err, data) => {
      if (err) {
        return res.status("400").json({ erorr: "Stock already exists." });
      }

      res.json(data);
    });
  } catch (err) {
    console.erorr(err);
    res.status(500).send("Internal server error.");
  }
};

exports.list = async (req, res) => {
  try {
    const stocks = await Stock.find();

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
  try {
    const stock = await Stock.findById(req.params.slug);

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
  // PUT
};

exports.remove = async (req, res) => {
  // DELETE
};
