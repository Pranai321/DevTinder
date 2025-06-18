const {Auth} = require('./middlewares/auth.js');
const express = require("express");
const connectDB = require('./config/database.js');
const User = require('./models/user.js');

const app = express(); 

app.post('/signup',async (req,res)=>{
    const user = new User({
        firstName:"pranai",
        lastName:"Reddy",
        emailId:"pranaisaireddy@gmail.com"
    })
    await user.save()
        .then(()=>{
        res.send("User signed-up")
    })
        .catch((err)=>{
            res.send("error saving user details in the DB")
        })
})
connectDB().then(()=>{
    console.log("App is connected to DB");
    app.listen(1777, ()=>{
    console.log("server is up and running on portal 1777");
})
}
    
).catch((err)=>{
    console.log("Database cannot be connected to app")
})

