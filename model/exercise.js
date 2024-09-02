const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const exerciseSchema = new Schema({
  user_id: SchemaTypes.String,
  description: SchemaTypes.String,
  duration: SchemaTypes.Number,
  date: SchemaTypes.Date,
});

module.exports = mongoose.model("Exercise", exerciseSchema);
