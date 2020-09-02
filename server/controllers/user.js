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
