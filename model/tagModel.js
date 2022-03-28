const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    _id: {
        type: String,
        required: true
      },
    timesClicked: {
        type: Number,
        required: true
      },
  
});

module.exports = mongoose.model("Tag", tagSchema);