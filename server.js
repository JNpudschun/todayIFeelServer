const express = require('express')
const mongoose = require("mongoose");
const app = express()
const PORT = process.env.PORT || 3000;

// const cors = require('cors');
// app.use(cors());
const mongoDB = "";
// mongoose.connect(mongoDB);

// app.get('/',(req,res)=>{
//     res.send("Server is running and listening to requests.")
// })

app.get("/articles", (req,res)=>{})
app.get("/articles/:id", (req,res)=>{})
app.post("/articles", (req,res)=>{})
app.delete("/articles/:id", (req,res)=>{})
app.get("/tags", (req,res)=>{})
app.get("/tags/:id", (req,res)=>{})
app.post("/tags/:id", (req,res)=>{})
app.delete("/tags/:id", (req,res)=>{})


app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });