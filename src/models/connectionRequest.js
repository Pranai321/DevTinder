const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId, 
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:'{value} is Incorrect'
        }
    }
},{timestamps:true})

connectionRequestSchema.pre("save",async function(next){
    try{
        const connectionRequest = this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("You cannot send request to yourself");
        }
    }catch(err){
        next(err);
    }
    next()
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema); 
module.exports = ConnectionRequest;