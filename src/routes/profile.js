const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const {editValidator} = require('../utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');


//gets all the details of the User using Id after Authentication using userAuth middleware
profileRouter.get('/profile', userAuth, async (req,res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.status(400).send("err " +err.message);
    }    
})
  
//Edit profile 
profileRouter.patch('/profile/edit', userAuth, async (req,res)=>{
    try{
        const isValid = editValidator(req);
        if(!isValid){
            throw new Error("Edit not allowed");
        }
        userDetails = req.user;
        changingDetails = req.body;
        Object.keys(changingDetails).forEach((field)=>{
            userDetails[field] =changingDetails[field];
        })
        await userDetails.save();
        res.json({message:"no error", 
            user:userDetails
        });
    }catch(err){
        res.status(400).send(err.message);
    }
    
})

//Change Password
profileRouter.patch('/profile/editPassword', userAuth, async (req,res)=>{

    try{
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword){
            throw new Error("Both current and new Passwords are required");
        }
        if(oldPassword === newPassword){
            throw new Error("new password cannot be same as current password");
        }
        const isValidated = await req.user.validatePassword(oldPassword);
        if(!isValidated){
            throw new Error("your current password is wrong");
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Password is not strong enough");
        }
        
        req.user.password = await bcrypt.hash(newPassword, 10);
        
        await req.user.save(); //this will run validators in the schema and save it to the DB
        res.send("Password Changed Successfully");
    }catch(err){
        res.send(err.message);
    }
    
})

module.exports = profileRouter;