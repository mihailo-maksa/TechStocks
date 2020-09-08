const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "TechStocks",
    API: "/api",
    PRODUCTION: true,
    DOMAIN: "http://ec2-3-21-164-109.us-east-2.compute.amazonaws.com",
    FB_APP_ID: "ABCDEFGHIJKLMNOPQRSTUVXYZ"
  }
});
