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
      type: {},
      min: 20,
      max: 20000
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
      // types: Growth or Value
      type: String,
      default: "Growth"
    },
    rating: {
      // ratings: Buy or Sell
      type: String,
      default: "Buy"
    },
    clicks: [
      {
        user: {
          type: ObjectId,
          ref: "User"
        }
      }
    ],
    clickCount: {
      type: Number,
      default: 0
    },
    ratings: [
      {
        user: {
          type: ObjectId,
          ref: "User"
        },
        rate: {
          type: String,
          default: "Bullish"
        }
      }
    ],
    bullishRatings: {
      type: Number,
      default: 0
    },
    bearishRatings: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = Stock = mongoose.model("Stock", StockSchema);
