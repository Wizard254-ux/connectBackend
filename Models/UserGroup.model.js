const mongoose=require('mongoose')

const UserGroupSchema=mongoose.Schema({
    userId:{
        type:String,
        required:[true,"User id required"]
    },
    groupIds:{
        type:[String],
        required:[true,"Please enter groupId name"]
    }
 },{
})

const UserGroup=mongoose.model("UserGroup",UserGroupSchema)

module.exports=UserGroup;