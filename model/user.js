const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: SchemaTypes.String,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
