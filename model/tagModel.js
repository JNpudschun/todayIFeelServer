const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true
      },
    timesClicked: {
        type: Number,
        default:0
      },
    weeklyTimesClicked: {
      type: Number,
      default: 0
    }
  
});

module.exports = mongoose.model("Tag", tagSchema);