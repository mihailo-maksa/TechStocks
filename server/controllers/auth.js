const AWS = require("aws-sdk");
const User = require("../models/User");
const Stock = require("../models/Stock");
const jwt = require("jsonwebtoken");
const shortId = require("shortId");
const expressJwt = require("express-jwt");
const {
  registerEmailParams,
  forgotPasswordEmailParams
} = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = async (req, res) => {
  const { username, email, password, categories } = req.body;

  try {
    const user = await User.findOne({ email });

    // check if user already exists
    if (user) {
      return res.status(400).json({ error: "Email is taken." });
    }

    // generate token with username, email and password
    const token = jwt.sign(
      { username, email, password, categories },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "15m" }
    );

    const params = registerEmailParams(email, token);

    try {
      const emailData = await ses.sendEmail(params).promise();

      console.log("Email Submitted to SES: ", emailData);

      res.status(200).json({
        message: `Email has been sent to ${email}. Please follow the instructions to complete your registration.`
      });
    } catch (err) {
      console.error("Error - SES Verification Email: ", err);
      res.status(500).json({
        error: `We couldn't verify your email. Please try again.`
      });
    }
  } catch (err) {
    console.error("Verification Mail Error: ", err);

    res.status(500).send("Internal server error.");
  }
};

exports.registerActivate = (req, res) => {
  const { token } = req.body;

  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Please register again."
        });
      }

      const { username, email, password, categories } = jwt.decode(token);

      const realUsername = shortId.generate();

      try {
        const user = await User.findOne({ email });

        if (user) {
          return res.status(401).json({ error: "Email is taken." });
        }

        const newUser = new User({
          username: realUsername,
          name: username,
          email,
          password,
          categories
        });

        await newUser.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: "An error occurred when trying to save the user."
            });
          }

          return res.status(200).json({
            message: "Registration succeeded. Please login."
          });
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
      }
    }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
      return res.status(400).json({
        error:
          "User with this email address does not exist. Please register first."
      });
    }

    // authenticate the user
    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ error: "Invalid credentials. Please try again" });
    }

    // generate the token and send it to the client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error.");
  }
};

exports.requireSignin = expressJwt({
  // req.user (by default) => makes userId (req.user._id) available
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256", "RS256"]
});

exports.authMiddleware = async (req, res, next) => {
  const authUserId = req.user._id;

  try {
    const user = await User.findOne({ _id: authUserId });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    req.profile = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.adminMiddleware = async (req, res, next) => {
  const adminUserId = req.user._id;

  try {
    const user = await User.findOne({ _id: adminUserId });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ error: "Admin resource. Access Denied." });
    }

    req.profile = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist." });
    }

    // generate token and email to user
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "15m" }
    );

    // send email
    const params = forgotPasswordEmailParams(email, token);

    // populate the db > user > resetPasswordLink
    return user.updateOne(
      { resetPasswordLink: token },
      async (err, success) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Password reset failed. Please try again." });
        }

        try {
          const emailData = await ses.sendEmail(params).promise();

          console.log("SES Reset Password Email: ", emailData);

          res.status(200).json({
            message: `Email has been sent to ${email}. Click on the link to reset your password.`
          });
        } catch (err) {
          console.error("Error - SES Email on Forgot Password: ", err);
          res.status(500).json({
            error: `We couldn't verify your email. Please try again.`
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword, resetPasswordLink } = req.body;

  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      async (err, success) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Expired link. Please try again" });
        }

        try {
          const user = await User.findOne({ resetPasswordLink });

          if (!user) {
            return res.status(400).json({
              error: "Invalid token. Please try again."
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
          };

          await user.updateOne({ ...updatedFields }, (err, success) => {
            if (err) {
              return res
                .status(400)
                .json({ error: "Password reset failed. Please try again." });
            }

            res.status(200).json({
              message:
                "Awesome! Now you can login into TechStocks with your new password."
            });
          });
        } catch (err) {
          console.error(err);
          res.status(500).send("Internal server error.");
        }
      }
    );
  }
};

exports.canUpdateDeleteStock = async (req, res, next) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findOne({ _id: id });

    if (!stock) {
      return res.status(400).json({ error: "Couldn't find stock." });
    }

    if (stock.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are unauthorized to perform this action." });
    }

    next();
  } catch (err) {
    console.error(`canUpdateDeleteStock middleware error: `, err);
    res.status(500).send("Internal server error.");
  }
};
