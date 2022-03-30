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

//Articles
app.get("/articles", (req,res)=>{
    Article.find({}, (err, data) => res.send(data))
})
app.get("/articles/:id", (req,res)=>{
    Article.find({id: req.params.id}, (err, data) => res.send(data));
})
app.post("/articles", (req,res)=>{
    const newArticle = req.body;
    if(newArticle.ext === false){
        Article.create({
            id: newArticle.id,
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            date: newArticle.date,    
        }).then(function(newArticles){
            res.send(newArticles);
        })
    } else {
        Article.create({
            id: newArticle.id,
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            date: newArticle.date,
        }).then(function(newArticles){
            res.send(newArticles);})
    }
   
})
app.put("/articles/:id", (req,res) => {
    const newArticle = req.body;
    Article.updateOne({id: req.params.id},{$set:{
        id: newArticle.id,
        title: newArticle.title,
        body: newArticle.body,
        tags: newArticle.tags,
        url: newArticle.url,
        ext: newArticle.ext,
        visible: newArticle.visible,   
    }}).then(function(newArticles){
        res.send(newArticles);})
})
app.delete("/articles/:id", (req,res)=>{
    Article.deleteOne({ id: req.params.id }).then(function () {
        res.end();
      });
})
//Search for Articles based on Tags
app.get("/search/:tags", (req,res)=>{
    let tagArr = req.params.tags.split(",");
    console.log(tagArr)
    Article.find({tags:{$in:[tagArr[0],tagArr[1],tagArr[2]]} }, (err, data) => {
        console.log(data);
        res.send(data)
    });
})

//Tags
app.get("/tags", (req,res)=>{
    Tag.find({}, (err, data) => res.send(data))
})
app.get("/tags/:name", (req,res)=>{
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
//Users

app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });