const {Auth} = require('./middlewares/auth.js');
const express = require("express");

const connectDB = require('./config/database.js');

const app = express(); 

connectDB().then(()=>{
    console.log("App is connected to DB");
    app.listen(1777, ()=>{
    console.log("server is up and running on portal 1777");
})
}
    
).catch((err)=>{
    console.log("Database cannot be connected to app")
})

