const express = require('express');
const app = express()
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyparser = require('body-parser');
const path = require("path");

const teachersRouter = require("./routes/Teacher")
const studentResultRouter = require('./routes/Result')

//PORT to run locally
const PORT =  3000

//DB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Exam";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if(err){
        console.log("error");
    }else{
        console.log('db conneced')
    }
})


app.use(bodyparser.json())
app.use(cookieParser());
app.use(express.json());

app.use(bodyparser.urlencoded({ extended: false }));



app.use('/Teachers',teachersRouter);
app.use('/Result',studentResultRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT,()=>{
   console.log(`App started on Port ${PORT}`) 
})