const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user.js");
const Exercise = require("./model/exercise.js");

const testDb = [];
let testUserId = 1;

app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cors({ optionsSuccessStatus: 200 })
);
app.use("/public", express.static(`${__dirname}/public`));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .post(function (req, res) {
    console.log(req.body);
    let name = req.body?.username;
    let id;
    if (testDb.find((o) => o.username === name)) {
      id = testDb.find((o) => o.username === name)._id;
    } else {
      id = "" + testUserId++;
      testDb.push({ username: name, _id: id });
    }
    res.json({
      username: name,
      _id: id,
    });
  })
  .get(function (req, res) {
    res.json(testDb);
  });

app.route("/api/users/:_id/exercises").post(function (req, res) {
  console.log(req.body);
  res.json({ placeholder: true });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
