const {Auth} = require('./middleware/auth.js');
const express = require("express");


const app = express();

app.use('/user',Auth);

app.get("/user",(req,res)=>{
    res.send({name:"pranai",age: 25});
})

// we can send the Auth middleware as 1st request handler, if Auth is success, it calls the next request handle
// app.get('/user', Auth, (req,res)=>{
//     res.send("Authenticated successfully");
// })

app.post("/user",(req,res)=>{
    res.send("data saved in the DB successfully");
})

app.put("/user",(req,res)=>{
    res.send("updated the profile");
})

app.patch("/user", (req,res)=>{
    res.send("patched the profile");
})

app.delete("/user",(req,res)=>{
    res.send("deleted the data")
})

app.listen(1777, ()=>{
    console.log("server is up and running on portal 1777");
})
