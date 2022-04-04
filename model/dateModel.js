const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expDateSchema = new Schema({
    expires: {
        type: Date,
        required: true
      },
    key: {
        type: Number,
        default:1
    }
});

module.exports = mongoose.model("ExpDate", expDateSchema);