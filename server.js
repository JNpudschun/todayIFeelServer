const express = require('express')
const mongoose = require("mongoose");
const user = require("./model/userModel")
const config = require("dotenv")
config.config();
const Article = require("./model/articlesModel")
const Tag = require("./model/tagModel")
const app = express()
const PORT = process.env.PORT || 3010;
const cors = require('cors');

app.use(cors());
const mongoDB = process.env.DB_CONNECT;
mongoose.connect(mongoDB);

app.get('/',(req,res)=>{
    res.send("Server is running and listening to requests.")
})
app.post("/",(req,res)=>{
    Tag.create({
        _id: "sad",
        timesClicked: 0,
    }).then(function(newTag){
        res.send(newTag);
    })
})

// Articles
app.get("/articles", (req,res)=>{})
app.get("/articles/:id", (req,res)=>{})
app.post("/articles", (req,res)=>{})
app.delete("/articles/:id", (req,res)=>{})

// Tags
app.get("/tags", (req,res)=>{})
app.get("/tags/:id", (req,res)=>{})
app.post("/tags/:id", (req,res)=>{})
app.delete("/tags/:id", (req,res)=>{})

// Users
app
.get("/user", (req,res)=>{

})
.get("/user/:id", (req,res)=>{

})
.post("/user", (req,res)=>{ // create / registrate new user

})
.delete("/user/:id", (req,res)=>{

})
.post("/login", (req, res) => {
  
})


app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });