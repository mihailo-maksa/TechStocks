const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 12,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    hashed_password: {
      type: String,
      required: true,
      min: 8
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber"
    },
    resetPasswordLink: {
      data: String,
      default: ""
    }
  },
  { timestamps: true }
);

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password; // temporary _password variable
    this.salt = this.makeSalt(); // generate salt
    this.hashed_password = this.encryptPassword(password); // hash the password
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainTextPassword) {
    return this.encryptPassword(plainTextPassword) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      console.error(err);
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  }
};

module.exports = User = mongoose.model("User", UserSchema);
