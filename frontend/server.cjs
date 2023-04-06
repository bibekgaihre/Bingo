const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "src", "index.html"));
});

app.listen(5002, () => {
  console.log("build is serving on port 5002");
});
