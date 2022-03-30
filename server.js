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
    try{
        Article.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
    }
})
app.get("/articles/:_id", (req,res)=>{
    try{
        Article.find({_id: req.params._id}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
    }
})
app.post("/articles", (req,res)=>{
    try{
        const newArticle = req.body;
        Article.create({
            // id: newArticle.id,
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            createdDate: newArticle.createdDate,    
        }).then(function(newArticles){
            res.send(newArticles);
        })
    }catch(error){
        console.log(error)
    }
   
})
app.put("/articles/:_id", (req,res) => {
    try{
        const newArticle = req.body;
        Article.updateOne({_id: req.params._id},{$set:{
            // id: newArticle.id,
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            updatedDate: Date.now(),   
        }}).then(function(newArticles){
            res.send(newArticles);})
    }catch(error){
        console.log(error)
    }
})
app.delete("/articles/:_id", (req,res)=>{
    try{
        Article.deleteOne({ _id: req.params._id }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
    }
})
//Search for Articles based on Tags
app.get("/search/:tags", (req,res)=>{
    try{
        let tagArr = req.params.tags.split(",");
        console.log(tagArr)
        Article.find({tags:{$in:[...tagArr]} }, (err, data) => {
            let arr3hits=[];
            let arr2hits=[];
            let arr1hits=[];
            for(let i = 0; i<data.length;i++){
                let count = 0;
                for(let j = 0; j<data[i].tags.length;j++){
                    if(tagArr.includes(data[i].tags[j])){
                        count +=1;
                    }
                }
                if(count ===3){
                    arr3hits.push(data[i])
                } else if(count ===2){
                    arr2hits.push(data[i])
                } else {
                    arr1hits.push(data[i])
                }
                
            }
            let sortedArr = arr3hits.concat(arr2hits).concat(arr1hits)
            res.send(sortedArr)
        });
    }catch(error){
        console.log(error)
    }
})

//Tags
app.get("/tags", (req,res)=>{
    try{
        Tag.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
    }
})
app.get("/tags/:name", (req,res)=>{
    try{
        Tag.find({name: req.params.name}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
    }
})
app.post("/tags", (req,res)=>{
    try{
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
    }catch(error){
        console.log(error)
    }
})
app.delete("/tags/:name", (req,res)=>{
    try{
        Tag.deleteOne({ name: req.params.name }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
    }
})
//Users

app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });