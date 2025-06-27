const {Auth} = require('./middlewares/auth.js');
const express = require("express");
const connectDB = require('./config/database.js');
const User = require('./models/user.js');

const app = express(); 

app.use(express.json()); //express.json() gives the middleware function that converts JSON object to a js object

app.post('/signup',async (req,res)=>{

    try{
        // if(req.body?.skills.length > 10){
        //     throw new Error("Skills should be less than 10");
        // }

        const user = new User(req.body);
        await user.save()

    .then(()=>{ res.send("User signed-up") })

    // .catch((err)=>{ res.status(404).send(err.message) })
    }catch(err){
        res.status(404).send(err.message)
    }
    //creating a new instance of a userModel
    
})

//gets all the details of a user based on the given field
app.get('/user', async (req,res)=>{

    try{
        const mail = req.body.emailId;
        const user = await User.find({emailId: mail});
        if(user.length===0){
            res.send("User not found");
        }else{
            res.send(user);
        }
        
    }catch(err){
        res.status(404).send("Something went wrong");
        
    }

})

//gets all the documents in a the User Collection for the Feed
app.get('/feed', async (req, res)=>{

    try{
        const users = await User.find({ });
        if(users.length ===0){
            res.send("No users found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.send("Something went wrong");
    }
    
})

//Delete a user(document) from User Collection
app.delete('/user', async(req,res)=>{
    // const userId = req.body.userId;
    const mail = req.body.mail;
    try{
        // await User.findByIdAndDelete(userId);
        await User.findOneAndDelete({emailId:mail});
        res.send("User Deleted");
    }catch(err){
        res.send("Something went wrong");
    }
})

//Update a a user(document)
app.patch('/user/:userId', async(req,res)=>{
    const userId = req?.params.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES =["password", "age", "photoUrl", "skills", "gender", "about"];
        const isUpdateAllowed = Object.keys(data).every((key)=>{
            return ALLOWED_UPDATES.includes(key);
        })
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const updatedUser = await User.findByIdAndUpdate(userId,req.body, {runValidators:true}, {new:true} ); //new= true returns the document after updated

        if(updatedUser === null){
            return res.status(404).send("Usernotfound");
        }
        res.send("User Updated");
    }catch(err){
        res.send(err.message);
    }
})
connectDB()
.then(()=>{
    console.log("App is connected to DB");
    app.listen(1777, ()=>{ console.log("server is up and running on portal 1777"); })
})
.catch((err)=>{
    console.log("Database cannot be connected to app")
})

