const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);