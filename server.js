const express = require('express')
const mongoose = require("mongoose");
const app = express()
const PORT = process.env.PORT || 3000;

// const cors = require('cors');
// app.use(cors());
const mongoDB = "";
// mongoose.connect(mongoDB);

app.get('/',(req,res)=>{
    res.send("Server is running and listening to requests.")
})

app.listen(PORT, () => {
    console.warn(`App listening on http://localhost:${PORT}`);
  });