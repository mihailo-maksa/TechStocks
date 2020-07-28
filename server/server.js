const express = require("express");
const path = require("path");
const serveFavicon = require("serve-favicon");

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(serveFavicon(path.join(__dirname, "public", "favicon.ico")));

// Define Routes
app.use("/api", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}...`);
});
