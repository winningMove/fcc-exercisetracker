const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user.js");

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
      testDb.push({ username: name, _id: id, log: [] });
    }
    res.json({
      username: name,
      _id: id,
    });
  })
  .get(function (req, res) {
    res.json(
      testDb.map((o) => {
        const { log, ...logless } = o;
        return logless;
      })
    );
  });

app.post("/api/users/:_id/exercises", function (req, res) {
  console.log(req.body);
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const user = testDb.find((o) => o._id === req.body._id);
  if (!user) {
    return res.json({ error: "no user exists with that id" });
  }

  user.log.push({
    description: description,
    duration: duration,
    date: date,
  });

  res.json({
    username: user.username,
    _id: user._id,
    description: description,
    duration: parseInt(duration),
    date: date.toDateString(),
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  const id = req.params._id;
  const user = testDb.find((o) => o._id === id);

  if (!user) {
    return res.json({ error: "no user exists with that id" });
  }

  let logToReturn = user.log;

  if (req.query) {
    if (req.query.from && req.query.to) {
      const fromDate = new Date(req.query.from);
      const toDate = new Date(req.query.to);
      logToReturn = logToReturn.filter(
        (e) => e.date >= fromDate && e.date <= toDate
      );
    }
    if (req.query.limit) {
      logToReturn = logToReturn.slice(
        logtoReturn.length - parseInt(req.query.limit)
      );
    }
  }

  res.json({
    ...user,
    log: logToReturn.map((o) => {
      return {
        ...o,
        date: o.date.toDateString(),
        duration: parseInt(o.duration),
      };
    }),
    count: logToReturn.length,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
