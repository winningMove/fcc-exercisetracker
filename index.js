const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user.js");
const Exercise = require("./model/exercise.js");

const testDb = {};
let testUserId = 1;

app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cors({ optionsSuccessStatus: 200 })
);
app.use(express.static("/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", function (req, res) {
  console.log(req.body);
  let name = req.body?.username;
  let id;
  if (Object.values(testDb).includes(name)) {
    id = Object.keys(testDb).find((k) => testDb[k] === name);
  } else {
    id = "" + testUserId++;
    testDb[id] = name;
  }
  res.json({
    username: name,
    _id: id,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
