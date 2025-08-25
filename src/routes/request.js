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
        
        const ALLOWED_STATUS = ["interested", "ignored"];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("status-"+status+"  Not Allowed!");
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
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

//accepting or rejecting the friend request using Id of connectionrequests
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req,res)=>{
    const {status, requestId } = req.params;
    const loggedInUser = req.user;
    const ALLOWED_STATUS = ["accepted","rejected"];
    if(!ALLOWED_STATUS.includes(status)){
        return res.status(400).json({
            message:"status is not accepted"
        })
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    })
    if(!connectionRequest){
        return res.status(400).json({
            message:"no Request available"
        })
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    res.json({
        message:"status changed successfully",
        data:connectionRequest
    })
})
module.exports = requestRouter;