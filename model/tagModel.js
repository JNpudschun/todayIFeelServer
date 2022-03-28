const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
 
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tag", tagSchema);