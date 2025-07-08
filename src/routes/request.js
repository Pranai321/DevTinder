const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");

//sending connection request after authenticating the useer using userAuth middleware
requestRouter.post('/request/send/:status/:userId',userAuth,async (req,res)=>{
    try{
        const status = req.params.status;
        const fromUserId = req.user._id;
        const toUserId = req.params.userId
        const toUser = await User.findById(toUserId);
        
        const ALLOWED_STATUS = ["interested", "ignored"]
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("status-"+status+"  Not Allowed!");
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        console.log(existingRequest);
        if(existingRequest){
            return res.status(400).json({
                message:"Request already exists"
            })
        }
        const connectionRequest = new ConnectionRequest({
        fromUserId:fromUserId,
        toUserId:toUserId,
        status:status
        })
        
        await connectionRequest.save();
        res.json({
            sender:req.user.firstName,
            receiver:toUser.firstName,
            status:status
        })
    }catch(err){
        res.status(400).send(err.message);
    }    
})

module.exports = requestRouter;