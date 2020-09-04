const User = require("../models/User");
const Stock = require("../models/Stock");

exports.read = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id }).select(
      "-hashed_password -salt"
    );

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    try {
      const allStocksByUser = await Stock.find({ postedBy: user })
        .populate("categories", "name slug")
        .populate("postedBy", "name")
        .sort({ createdAt: -1 });

      if (!allStocksByUser) {
        return res.status(400).json({ error: "Could not find any stocks." });
      }

      res.json({ user, stocks: allStocksByUser });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.update = async (req, res) => {
  try {
    const { name, password, categories } = req.body;

    if (password && password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, password, categories },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "Could not find user to update." });
    }

    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};
