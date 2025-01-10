const mongoose=require('mongoose')
const MessagesSchema=mongoose.Schema({
    sender:{
        type:String,
        require:[true,"Sender username required"]
    },
    senderId:{
        type:String,
        required:[true,"Sender id required"]
    },
    groupId:{
        type:String,
        required:[true,"groupId  required"]
    },
    content:{
    type:String,
        required:[true,"Enter message content"]
    }
},{
    timestamps:true
}

)

const groupMessages=mongoose.model("groupMessages",MessagesSchema)
module.exports=groupMessages