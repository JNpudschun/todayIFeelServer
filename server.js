const express = require('express')
const mongoose = require("mongoose");
const config = require("dotenv")
config.config();
const Article = require("./model/articlesModel")
const Tag = require("./model/tagModel")
const app = express()
const PORT = process.env.PORT || 3010;
const cors = require('cors');
app.use(express.json())
app.use(cors());
const mongoDB = process.env.DB_CONNECT;
mongoose.connect(mongoDB);

app.get('/',(req,res) => {
    res.send("Server is running and listening to requests.")
})
// app.post("/",(req,res) => {
//     const newTag = req.body;
//     console.log(JSON.stringify(req.body))
//     Tag.create({
//         name:newTag.name,
//         timesClicked: newTag.timesClicked
//     }).then(function(newTag){
//         res.send(newTag);
//     })
// })

app.get("/articles", (req,res)=>{})
app.get("/articles/:id", (req,res)=>{})
app.post("/articles", (req,res)=>{})
app.delete("/articles/:id", (req,res)=>{})
app.get("/tags", (req,res)=>{
    Tag.find({}, (err, data) => res.send(data))
})
app.get("/tags/:name", (req,res)=>{
    console.log(req.params.name)
    Tag.find({name: req.params.name}, (err, data) => res.send(data));
})
app.post("/tags", (req,res)=>{
    const newTag = req.body;
    console.log(newTag)
    Tag.exists({name:newTag.name},(error, result)=>{
        console.log(JSON.stringify(result).length)
        if (error){
            console.log(error)
        } else {
            if(JSON.stringify(result).length < 5){
                Tag.create({
                            name:newTag.name,
                            timesClicked: newTag.timesClicked
                        }).then(function(newTag){
                            res.send(newTag);
                        })
            } else {
                Tag.updateOne({name:newTag.name},{$inc:{timesClicked:1}}).then(function (updatedTag) {
                    res.send(updatedTag);
                });
            }             
        }
    })
})

app.delete("/tags/:name", (req,res)=>{
    Tag.deleteOne({ name: req.params.name }).then(function () {
        res.end();
      });
})


app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });