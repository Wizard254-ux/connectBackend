const mongoose=require('mongoose')
const MessagesSchema=mongoose.Schema({
    sender:{
        type:String,
        require:[true,"Sender id required"]
    },
    receiver:{
        type:String,
        required:[true,"Receiver name required"]
    },
    receiverId:{
        type:String,
        required:[true,"Receiver id required"]
    },
    senderId:{
        type:String,
        required:[true,"Sender id required"]
    },
    groupId:{
        type:String,
        required:[true,"Enter groups id"]
    },
    content:{
    type:String,
        required:[true,"Enter message content"]
    }
},{
    timestamps:true
}

)

const privateMessages=mongoose.model("privateMessages",MessagesSchema)
module.exports=privateMessages