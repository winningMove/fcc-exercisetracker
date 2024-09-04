const { default: mongoose, Schema } = require("mongoose");

const exerciseSchema = new Schema(
  {
    description: String,
    duration: Number,
    date: { type: Date, get: (v) => v.toDateString() },
  },
  { _id: false }
);

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  exerciseLog: [exerciseSchema],
});

module.exports = mongoose.model("User", userSchema);
