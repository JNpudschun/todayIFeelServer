const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  id:{ type: Number, required: true, unique:true},
  title:{ type:String, required: true},
  body:{ type:String, required: true},
  tags:{ type:Array, required: true},
  url:{ type:String},
  ext:{ type:Boolean, required: true},
  visible:{ type:Boolean, required: true},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);