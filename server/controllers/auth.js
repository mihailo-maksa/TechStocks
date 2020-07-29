const AWS = require("aws-sdk");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { registerEmailParams } = require("../utils/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // check if user already exists
    if (user) {
      return res.status(400).json({ error: "Email is taken" });
    }

    // generate token with username, email and password
    const token = jwt.sign(
      { username, email, password },
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
      console.error("Error - SES Email on Register: ", err);
      res.status(500).json({
        error: `We couldn't verify your email. Please try again.`
      });
    }
  } catch (err) {
    console.error("Verification Mail Error: ", err);

    res.status(500).send("Internal Server Error");
  }
};
