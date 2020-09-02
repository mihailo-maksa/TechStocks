const Category = require("../models/Category");
const Stock = require("../models/Stock");
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

    // add the id of the user that created the category
    category.postedBy = req.user._id;

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
      return res.status(400).json({ error: "Couldn't list categories." });
    }

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  try {
    const category = await Category.findOne({
      slug: slug
    }).populate("postedBy", "_id name username");

    if (!category) {
      return res.status(400).json({ error: "Couldn't find category." });
    }

    const stocks = await Stock.find({ categories: category })
      .populate("postedBy", "_id name username")
      .populate("categories", "name")
      .sort({ createdAt: -1 }) // gets you the latest stocks first
      .limit(limit)
      .skip(skip);

    if (!stocks) {
      return res
        .status(400)
        .json({ error: "Couldn't load links for this category." });
    }

    res.json({ category, stocks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.body;

  try {
    let updatedCategory = await Category.findOneAndUpdate(
      { slug: slug },
      { name, content },
      { new: true, upsert: true }
    );

    if (!updatedCategory) {
      return res.status(400).json({
        error: "Could not find the category to update."
      });
    }

    if (image) {
      // remove the existing image from S3 before uploading a new one
      const deleteParams = {
        Bucket: "techstocks-images",
        Key: `${updatedCategory.image.key}`
      };

      s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
          console.log(`S3 delete error during update: `, err);
        } else {
          console.log(`S3 data after deletion of the old image: `, data);
        }

        const base64Data = new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const type = image.split(";")[0].split("/")[1];

        // handle uploading new image
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

          updatedCategory.image.url = data.Location;
          updatedCategory.image.key = data.Key;

          // add the id of the user that created the category
          updatedCategory.postedBy = req.user._id;

          // save to MongoDB
          updatedCategory.save((err, success) => {
            if (err) {
              res.status(400).json({ error: "Error - duplicate category." });
            }
            res.json(success);
          });
        });
      });
    } else {
      res.json(updatedCategory);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;

  try {
    const deletedCategory = await Category.findOneAndRemove({ slug });

    if (!deletedCategory) {
      return res.status(400).json({
        error: "Could not delete category."
      });
    }

    const deleteParams = {
      Bucket: "techstocks-images",
      Key: `${deletedCategory.image.key}`
    };

    s3.deleteObject(deleteParams, (err, data) => {
      if (err) {
        console.log(`S3 delete error during deletion of the category: `, err);
      } else {
        console.log(`S3 data after deletion of the old image: `, data);
      }
    });

    res.status(200).json({
      message: "Category deleted successfully."
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};
