const { default: mongoose, Schema } = require("mongoose");

const exerciseSchema = new Schema(
  {
    description: String,
    duration: Number,
    date: Date,
  },
  { _id: false }
);

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  exerciseLog: { type: [exerciseSchema], default: [] },
});

module.exports = mongoose.model("User", userSchema);
