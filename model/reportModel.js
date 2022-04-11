const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reason: {
        type: String,
      },
    comment: {
        type: String,
      },
    article: {
      type: Object,
    }
  
});

module.exports = mongoose.model("Report", reportSchema);