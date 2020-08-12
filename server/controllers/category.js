const Category = require("../models/Category");
const slugify = require("slugify");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.create = (req, res) => {
  const { name, image, content } = req.body;

  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const type = image.split(";")[0].split("/")[1];
  const slug = slugify(name);
  let category = new Category({ name, content, slug });

  const params = {
    Bucket: "techstocks-images",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read", // Access Control List
    ContentEncoding: "base64",
    ContentType: `image/${type}`
  };

  s3.upload(params, (err, data) => {
    if (err) res.status(400).json({ error: "Upload to S3 failed." });

    category.image.url = data.Location;
    category.image.key = data.Key;

    // save to MongoDB
    category.save((err, success) => {
      if (err) {
        res.status(400).json({ error: "Error - duplicate category." });
      }
      return res.json(success);
    });
  });
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(400).json({ error: "No categories found." });
    }

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.read = async (req, res) => {
  try {
    const category = await Category.findById(req.params.slug);

    if (!category) {
      return res.status(400).json({ error: "No category found." });
    }

    res.json(category);
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
