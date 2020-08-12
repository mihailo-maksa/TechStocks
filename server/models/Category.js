const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 32
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },
    image: {
      url: String,
      key: String
    },
    content: {
      type: {}, // means you can add any type of data you want there
      min: 20,
      max: 20000
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model("Category", CategorySchema);
