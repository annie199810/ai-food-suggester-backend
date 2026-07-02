const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  query: String,
  suggestion: String,
}, { timestamps: true });

module.exports = mongoose.model("Suggestion", suggestionSchema);