const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const exerciseSchema = new Schema({
  user_id: String,
  description: String,
  duration: Number,
  date: { type: Date, get: (v) => v.toDateString() },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
