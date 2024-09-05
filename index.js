const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user");

app.use(
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Private-Network", true);
    next();
  },
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cors({ optionsSuccessStatus: 200 })
);
app.use("/public", express.static(`${__dirname}/public`));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to database.");
  })
  .catch((e) => {
    console.log("Failed to connect to database due to error: " + e);
  });
mongoose.connection.on("error", (e) => {
  console.log("Error: " + e);
});

app
  .route("/api/users")
  .post(async (req, res) => {
    const name = req.body?.username;

    let user = await User.findOne({ username: name }, "-exerciseLog").exec();
    if (user) return res.json({ error: "User with that name already exists." });

    const { username, id } = await new User({ username: name }).save();

    res.json({
      username,
      _id: id,
    });
  })
  .get(async (_, res) => {
    const users = await User.find({}, "-exerciseLog").exec();
    res.json(users.map(({ username, id }) => ({ username, _id: id })));
  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const idParam = req.params._id;

  let user = await User.findById(idParam).exec();
  if (!user) {
    return res.json({ error: "No user exists with that id." });
  }

  let { description, duration, date: tempDate } = req.body;
  duration = parseInt(duration);
  const date = tempDate ? new Date(tempDate) : new Date();

  user.exerciseLog.push({ description, duration, date });
  user = await user.save();

  res.json({
    username: user.username,
    _id: user.id,
    description,
    duration,
    date: date.toDateString(),
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const idParam = req.params._id;
  let user = await User.findById(idParam).exec();
  if (!user) {
    return res.json({ error: "No user exists with that id." });
  }
  const { username, id } = user;

  if (user.exerciseLog.length === 0) {
    return res.json({
      username,
      _id: id,
      log: [],
      count: 0,
    });
  }

  let logToReturn = [...user.exerciseLog];
  const { from, to, limit } = req.query;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    logToReturn = logToReturn.filter(
      (e) => e.date >= fromDate && e.date <= toDate
    );
  }
  if (limit) {
    logToReturn = logToReturn.slice(-parseInt(limit));
  }

  res.json({
    username,
    _id: id,
    log: logToReturn.map(({ description, duration, date }) => ({
      description,
      duration,
      date: date.toDateString(),
    })),
    count: logToReturn.length,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
