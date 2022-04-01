const express = require('express')
const mongoose = require("mongoose");
const config = require("dotenv")
config.config();
const Article = require("./model/articlesModel")
const Tag = require("./model/tagModel")
const User = require("./model/userModel")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const app = express()
const PORT = process.env.PORT || 3010;
const cors = require('cors');
app.use(express.json())
app.use(cors());
app.use(cookieParser());
const mongoDB = process.env.DB_CONNECT;
mongoose.connect(mongoDB).then((result) => app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);}))
.catch((err) => console.log(err));

app.get('/',(req,res) => {
    res.send("Server is running and listening to requests.")
})

//Articles
app.get("/articles", (req,res)=>{
    try{
        Article.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
app.get("/articles/:_id", (req,res)=>{
    try{
        Article.find({_id: req.params._id}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
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
        res.send(error)
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
        res.send(error)
    }
})
app.delete("/articles/:_id", (req,res)=>{
    try{
        Article.deleteOne({ _id: req.params._id }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
        res.send(error)
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
        res.send(error)
    }
})

//Tags
app.get("/tags", (req,res)=>{
    try{
        Tag.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
app.get("/tags/:name", (req,res)=>{
    try{
        Tag.find({name: req.params.name}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
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
        res.send(error)
    }
})
app.delete("/tags/:name", (req,res)=>{
    try{
        Tag.deleteOne({ name: req.params.name }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
// Users
function handleErrors(err){
    console.log(err.message, err.code)
    let errors = { email:'',password:''}
    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    //duplicate Errorcode
    if(err.code === 11000){
        errors.email = 'That email is already registered'
        return errors;
    }
    //validationerrors
    if(err.message.includes('User validation failed')){
        console.log(err)
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
    }
    return errors;
}
const maxAge = 1 * 24 * 60 * 60; // one day in seconds
function createToken(id){
    return jwt.sign({ id }, process.env.SECRET_STRING, {expiresIn:maxAge})
}
app
.get("/user", (req,res)=>{
    try{
        User.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
.get("/user/:_id", (req,res)=>{
    try{
        User.find({_id: req.params._id}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
.delete("/user/:_id", (req,res)=>{
    try{
        User.deleteOne({ _id: req.params._id }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
.post("/user", async (req,res)=>{ // create / registrate new user
    const newUser = req.body;
    try{
        const user = await User.create({
            email: newUser.email,
            password: newUser.password
        })
        console.log(user)
        const token = await createToken(user._id);
        res.cookie('jwt',token,{maxAge:maxAge * 1000})
        res.status(201).json({ user: user._id });
    } catch (error){
        const errors = handleErrors(error);
        res.status(400).json({errors})
    }
})
.post("/login", async (req, res) => {
    const { email, password } = req.body;

  try {
    const user = await User.authenticate(email, password);
    const token = await createToken(user._id);
    res.cookie('jwt',token,{maxAge:maxAge * 1000})
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({errors})
  }
  
})
.get("/logout", (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.send("User successfully logged out")
})
.get("/verify", (req,res)=>{
    const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.SECRET_STRING, (err, decodedToken) => {
      if (err) {
        res.send(err.message);
      } else {
        // console.log(decodedToken);
        res.send("OK")
      }
    });
  } else {
    res.send("Not verified")
  }
})
