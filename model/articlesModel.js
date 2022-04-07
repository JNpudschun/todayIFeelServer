const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title:{ type:String, required: true},
  body:{ type:String, required: true},
  tags:{ type:Array, required: true},
  url:{ type:String, default:"/"},
  ext:{ type:Boolean, required: true, default: false},
  visible:{ type:Boolean, required: true, default: true},
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);