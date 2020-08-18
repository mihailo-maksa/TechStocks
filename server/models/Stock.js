const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 256
    },
    ticker: {
      type: String,
      required: true,
      trim: true,
      max: 20
    },
    description: {
      type: String,
      required: true,
      trim: true,
      min: 20
    },
    url: {
      // URL to company's website, investor presentation,
      // investor relations page, your bullish/bearish thesis, etc.
      type: String,
      trim: true,
      required: true,
      max: 256
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },
    postedBy: {
      type: ObjectId,
      ref: "User"
    },
    categories: [
      // determines in which industry company is in
      // (e.g. SaaS, Cloud, Biotech, etc.)
      {
        type: ObjectId,
        ref: "Category",
        required: true
      }
    ],
    type: {
      /* types: Growth, High Growth, Speculative, Value, Dividend,
      Dividend Growth, Defensive, Disruptive, Other, etc. */
      type: String,
      default: "Growth"
    },
    rating: {
      // ratings: Strong Buy, Buy, Hold, Sell, Strong Sell
      type: String,
      default: "Buy"
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = Stock = mongoose.model("Stock", StockSchema);
