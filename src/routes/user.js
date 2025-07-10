const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = ["firstName", "lastName","skills","age","gender","photoUrl"]

//friend requests of a loggedin user
userRouter.get('/user/requests/received', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
        toUserId:loggedInUser,
        status:"interested"
    }).populate("fromUserId");
    res.json({
        message:"requests fetched successfully",
        data:connectionRequests
    })
    }catch(err){
        res.status(400).send(err.message)
    }
    

})

//connections(Friends List) of a logged in user
userRouter.get('/user/connections', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id, status:"accepted"},
            {fromUserId:loggedInUser._id, status:"accepted"}
        ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        const data = connections.map((request)=>{
            if(request.fromUserId.equals(loggedInUser)){
                return request.toUserId;
            }else{
                return request.fromUserId;
            }

        })
        res.json({
            data:data
        });
    }catch(err){
        res.status(400).send(err.message);
    }
    
})
module.exports = userRouter;