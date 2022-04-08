//importing neccessary packages
const express = require('express')
const mongoose = require("mongoose");
const config = require("dotenv")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const cors = require('cors');
//importing Schema and Dtabasemodels
const Article = require("./model/articlesModel")
const Tag = require("./model/tagModel")
const User = require("./model/userModel")
const ExpDate = require("./model/dateModel")
//creating needed variables
config.config();
const mongoDB = process.env.DB_CONNECT;
const app = express()
const PORT = process.env.PORT || 3010;
//setting up the app to use neccesary middleware
app.use(express.json())


const corsOptions ={
    origin:'https://todayifeel.netlify.app/', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(cookieParser());
// connecting to database and after that setting app to listen on correct port
mongoose.connect(mongoDB).then((result) => app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);}))
.catch((err) => console.log(err));
// app.use((req, res, next) => {
//     const corsWhitelist = [
//         'http://localhost:3000',
//         'https://todayifeel.netlify.app/'
//     ];
//     if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
//         res.header('Access-Control-Allow-Origin', req.headers.origin);
//         res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//         res.setHeader('Access-Control-Allow-Credentials', true);
//     }

//     next();
// });
// Add headers before the routes are defined
// app.use(function (req, res, next) {
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

//     // // Set to true if you need the website to include cookies in the requests sent
//     // // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     // Pass to next layer of middleware
//     next();
// })
//anchor so something is displayed on root when server is running
app.get('/',(req,res) => {
    res.send("Server is running and listening to requests.")
})

//ARTICLES

//GET a list of all articles
app.get("/articles", (req,res)=>{
    try{
        Article.find({}, (err, data) => res.send(data)).sort({createdDate: -1})
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//GET a single article by his id
app.get("/articles/:_id", (req,res)=>{
    try{
        Article.find({_id: req.params._id}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//POST a new article to the database
app.post("/articles", (req,res)=>{
    try{
        const newArticle = req.body;
        console.log(req.body)
        Article.create({
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            createdDate: newArticle.createdDate,    
        }).then(function(newArticles){
            for(let i = 0;i< newArticles.tags.length;i++){
                console.log(newArticles.tags[i])
                Tag.exists({name:newArticles.tags[i]},(error, result)=>{
                    // console.log(JSON.stringify(result).length)
                    if (error){
                        console.log(error)
                    } else {
                        console.log(result)
                        //ObjectId gets retuned or an empty object and 
                        //the stringyfied version of the Object has a lengt of 4
                        //so we check this way if there is a returned Id
                        if(JSON.stringify(result).length < 5){
                            
                            //cretate the new Tag and send it back as a response
                            Tag.create({
                                        name:newArticles.tags[i],
                                    })
                        }          
                    }
                })
            }
            res.send(newArticles)
        })
    }catch(error){
        console.log(error)
        res.send(error)
    }
   
})
//Modify a existing article in the database
app.put("/articles/:_id", (req,res) => {
    try{
        const newArticle = req.body;
        for(let i = 0;i< newArticle.tags.length;i++){
            console.log(newArticle.tags[i])
            Tag.exists({name:newArticle.tags[i]},(error, result)=>{
                // console.log(JSON.stringify(result).length)
                if (error){
                    console.log(error)
                } else {
                    console.log(result)
                    //ObjectId gets retuned or an empty object and 
                    //the stringyfied version of the Object has a lengt of 4
                    //so we check this way if there is a returned Id
                    if(JSON.stringify(result).length < 5){
                        
                        //cretate the new Tag and send it back as a response
                        Tag.create({
                                    name:newArticle.tags[i],
                                })
                    }          
                }
        })}
        Article.updateOne({_id: req.params._id},{$set:{
            title: newArticle.title,
            body: newArticle.body,
            tags: newArticle.tags,
            url: newArticle.url,
            ext: newArticle.ext,
            visible: newArticle.visible,
            updatedDate: Date.now(),   
        }}).then(function(newArticles){
            console.log(newArticles)
            res.send(newArticles);})
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//DELETE an article by id from the datavase
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
//SEARCH for all articles with one of the tags in the params
app.get("/search/:tags", async (req,res)=>{
    try{
        //split params into an arry for easyer database querying
        let tagArr = req.params.tags.split(",");
        let indicator = tagArr.shift();
        console.log(indicator,tagArr,req.cookies.voted)
        if(indicator === "vote" && req.cookies.voted){
            // res.cookie('voted',false,{maxAge:1})
            res.send("You already voted today please use the searchfunction or try again after 0:00GMT")
        }else if(indicator === "vote" && !req.cookies.voted ){
            //looks for all articles tha have tag thats inside the tagArr
            Article.find({tags:{$in:[...tagArr]} }, (err, data) => {
                //Arrays to help sort returned articles by number of tags out of tagArr an article has
                let arr3hits=[];
                let arr2hits=[];
                let arr1hits=[];
                // go over the returned articles and theyr tags to get number of article tags in tagArr
                for(let i = 0; i<data.length;i++){
                    let count = 0;
                    for(let j = 0; j<data[i].tags.length;j++){
                        if(tagArr.includes(data[i].tags[j])){
                            count +=1;
                        }
                    }
                    //sort Articles by number of hits into diffrent arrays
                    if(count ===3){
                        arr3hits.push(data[i])
                    } else if(count ===2){
                        arr2hits.push(data[i])
                    } else {
                        arr1hits.push(data[i])
                    } 
                }
                //concat arrays to returne on array of results second sortng criteria is by id
                let sortedArr = arr3hits.concat(arr2hits).concat(arr1hits)
                // console.log(sortedArr) 
                let tagRetArr=[]           
                for(let i = 0; i<tagArr.length;i++){
                     //check in database if Tag exists if yes returns the ObjectId of the tag
                    Tag.exists({name:tagArr[i]},(error, result)=>{
                        // console.log(JSON.stringify(result).length)
                        if (error){
                            console.log(error)
                        } else {
                            //ObjectId gets retuned or an empty object and 
                            //the stringyfied version of the Object has a lengt of 4
                            //so we check this way if there is a returned Id
                            if(JSON.stringify(result).length < 5){
                                //cretate the new Tag and send it back as a response
                                Tag.create({
                                            name:tagArr[i],
                                            timesClicked: 1,
                                            weeklyTimesClicked: 1
                                        }).then(function(tag){
                                            tagRetArr.push(tag)
                                        })
                            } else {
                                //If the Tag already exists we only ever want to change the clickcounter this way so
                                //it gets increased by one when the method gets called
                                Tag.updateOne({name:tagArr[i]},{$inc:{timesClicked:1, weeklyTimesClicked:1}}).then(function(tag){
                                    tagRetArr.push(tag)
                                });      
                            }             
                        }
                    })   
                }
                let date = new Date(Date.now() + (3600 * 1000 * 24))
                let dateArray = [date.getFullYear(),date.getMonth(),date.getDate()]
                if(dateArray[1] < 9){
                    dateArray[1] = '0'+ (dateArray[1]+1);
                } else if(dateArray[1] === 9){
                    dateArray[1] += 1;
                }
                if(dateArray[2] < 9){
                    dateArray[2] = '0'+ (dateArray[2]+1);
                } else if(dateArray[2] === 9){
                    dateArray[2] += 1;
                }
                const date2 = new Date(dateArray[0]+'-'+dateArray[1]+'-'+dateArray[2]+'T00:00:00')
                const date3 = new Date(date2 - (3600 * 1000 * 22));                
                res.cookie('voted',true,{expires:date3,sameSite:"none",secure:true})
                res.send(sortedArr)
            }); 
        }
        if(indicator === "search"){
            //looks for all articles tha have tag thats inside the tagArr
            Article.find({tags:{$in:[...tagArr]} }, (err, data) => {
                //Arrays to help sort returned articles by number of tags out of tagArr an article has
                let arr3hits=[];
                let arr2hits=[];
                let arr1hits=[];
                // go over the returned articles and theyr tags to get number of article tags in tagArr
                for(let i = 0; i<data.length;i++){
                    let count = 0;
                    for(let j = 0; j<data[i].tags.length;j++){
                        if(tagArr.includes(data[i].tags[j])){
                            count +=1;
                        }
                    }
                    //sort Articles by number of hits into diffrent arrays
                    if(count ===3){
                        arr3hits.push(data[i])
                    } else if(count ===2){
                        arr2hits.push(data[i])
                    } else {
                        arr1hits.push(data[i])
                    } 
                }
                //concat arrays to returne on array of results second sortng criteria is by id
                let sortedArr = arr3hits.concat(arr2hits).concat(arr1hits)
                // console.log(sortedArr)
                res.send(sortedArr)
            });             
        }
        
    }catch(error){
        console.log(error)
        res.send(error)
    }
})

//TAGS

//GET a list of all tags and their clickcounts 
app.get("/tags", (req,res)=>{
    try{
        Tag.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//GET one Tag by its name(displayed value)
app.get("/tags/:name", (req,res)=>{
    try{
        Tag.find({name: req.params.name}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
    }
})


//CREATE an new Tag or update a existing one f it already exists
app.post("/tags", (req,res)=>{
    try{
        // get the tag information out of the requestbody
        const newTag = req.body;
         //check in database if Tag exists if yes returns the ObjectId of the tag
        Tag.exists({name:newTag.name},(error, result)=>{
            // console.log(JSON.stringify(result).length)
            if (error){
                console.log(error)
            } else {
                //ObjectId gets retuned or an empty object and 
                //the stringyfied version of the Object has a lengt of 4
                //so we check this way if there is a returned Id
                if(JSON.stringify(result).length < 5){
                    
                    //cretate the new Tag and send it back as a response
                    Tag.create({
                                name:newTag.name,
                                timesClicked: newTag.timesClicked,
                                weeklyTimesClicked: newTag.weeklyTimesClicked
                            }).then(function(tag){
                                res.send(tag)
                            })
                } else {
                    //If the Tag already exists we only ever want to change the clickcounter this way so
                    //it gets increased by one when the method gets called
                    Tag.updateOne({name:newTag.name},{$inc:{timesClicked:1, weeklyTimesClicked:1}}).then(function (updatedTag) {
                        res.send(updatedTag)
                    });      
                }             
            }
        })   
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//DELETE a Tag by its name from the database
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
// USERS / AUTHORIZATION

//function to handle indiviual errors on login and return pecific error messages
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
//Maximum age of the login jwt token
const maxAge = 1 * 24 * 60 * 60; // one day in seconds
//function create a token based on a secret String for a given UserId
function createToken(id){
    return jwt.sign({ id }, process.env.SECRET_STRING, {expiresIn:maxAge})
}
//GET a list of all registered Users
app.get("/user", (req,res)=>{
    try{
        User.find({}, (err, data) => res.send(data))
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//GET a singular user by his id
app.get("/user/:_id", (req,res)=>{
    try{
        User.find({_id: req.params._id}, (err, data) => res.send(data));
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//DELETE a user by his id
app.delete("/user/:_id", (req,res)=>{
    try{
        User.deleteOne({ _id: req.params._id }).then(function () {
            res.end();
        });
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//CREATE a new User and signup the User and Log him in after creating a jwt token for him
app.post("/user", async (req,res)=>{
    // get the send email and passwort for the new user
    const newUser = req.body;
    try{
        //create the new user
        const user = await User.create({
            email: newUser.email,
            password: newUser.password
        })
        // console.log(user)
        //create then attach the token to a cookie for the user
        const token = await createToken(user._id);
        res.cookie('jwt',token,{maxAge:maxAge * 1000,sameSite:"none",secure:true})
        //respond with created user id and giving the cookie to logged in user in the process
        res.send({ user: user._id });
    } catch (error){
        const errors = handleErrors(error);
        res.send({errors})
    }
})
//LOGIN a user and create jwt token for him 
app.post("/login", async (req, res) => {
    //Get the send login credentials
    const { email, password } = req.body;
    try {
        // call method to authenticate the credentials
        const user = await User.authenticate(email, password);
        // since user will be empty if the authentification doesn't match
        // we can continue by creating the token for the verified user
        const token = await createToken(user._id);
        // return the cookie with the jwt token and the userid
        res.cookie('jwt',token,{maxAge:maxAge * 1000,sameSite:"none",secure:true})
        res.send({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.send({errors})
    }
})
//LOGOUT a user by giving him a cookie of same name thats emoty and expires after 2 millisecong
app.get("/logout", (req,res)=>{
    res.cookie('jwt','',{maxAge:1,sameSite:"none",secure:true})
    res.send("User successfully logged out")
})
//VERIFY the Token of user trying to access a route that has accescontrol on it
app.get("/verify", (req,res)=>{
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.SECRET_STRING, (err, decodedToken) => {
            if (err) {
                res.send(err.message);
            } else {
                // console.log(decodedToken);
                //Return certain string if user is verified 
                res.send("OK")
            }
        });
    } else {
        //Return a diffrent string if user is not verified
        res.send("Not verified")
    }
})
function setExpDate(){
    ExpDate.find({key: 1}).then(result =>{
        weeklyExpirationDate = result[0];
        // console.log(result)
        if(result.length === 0){
            let date = new Date('2022-04-12T00:00:00');
            let date2 =new Date(date - (3600 * 1000 * 22));   
            console.log(date2.toUTCString(),"Entered Create")
            ExpDate.create({
                expires: date2
            }).then((date)=> {
                weeklyExpirationDate = date;
                console.log(weeklyExpirationDate)
            })
              
        }
        // weeklyExpirationDate = result;
        console.log(weeklyExpirationDate)
    })
    
}
function intervalFunc() {
    if(count === 0){
        console.log("Entered first load")
        setExpDate();
        count+=1;
    }else{
        console.log("Entered updatecheck")
        let date = new Date();
        console.log(date,weeklyExpirationDate.expires,count)
        if(date > weeklyExpirationDate.expires){
            weeklyExpirationDate.expires.setDate(weeklyExpirationDate.expires.getDate()+7)
            console.log(weeklyExpirationDate)
            Tag.updateMany({},{$set:{weeklyTimesClicked:0}}).then(tag=>console.log(date))
            ExpDate.updateOne({key:1},{$set:{expires:weeklyExpirationDate.expires}}).then(date=>console.log(date))
            count+=1;
        }
    }  
  }
let weeklyExpirationDate;
let count = 0; 
setInterval(intervalFunc, 1000*60);