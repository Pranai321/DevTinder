const {Auth} = require('./middleware/auth.js');
const express = require("express");


const app = express();

// app.get("/getuserdata",(req,res)=>{
//     try{
//         //logic
//         throw new Error("Object");
//     }
//     catch(err){
//         res.send(err.message);
//     }
// })
app.get('/getuserdata',(req,res)=>{

    throw new Error("error object");
});
app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err.message);   
        res.send("something went wrong")
    }
})
app.listen(1777, ()=>{
    console.log("server is up and running on portal 1777");
})
