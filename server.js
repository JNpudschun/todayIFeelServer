const express = require('express')
const mongoose = require("mongoose");
const article = require("./model/articlesModel")
const tag = require("./model/tagModel")
const user = require("./model/userModel")
const app = express()
const PORT = process.env.PORT || 3010;

// const cors = require('cors');
// app.use(cors());
const mongoDB = "";
// mongoose.connect(mongoDB);

// app.get('/',(req,res)=>{
//     res.send("Server is running and listening to requests.")
// })

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