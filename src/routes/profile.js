const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');

//sending connection request after authenticating the useer using userAuth middleware
profileRouter.post('/sendConnectionRequest', userAuth, (req,res)=>{
    try{
        res.send(req.user.firstName+" sent a connection request");
    }catch(err){
        res.status(400).send(err.message);
    }
    
})

module.exports = profileRouter;