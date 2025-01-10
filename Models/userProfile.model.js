const mongoose=require('mongoose')

const UserProfileSchema=mongoose.Schema({

age:{
    type:Number,
    required:[true,"enter Age"]
},
gender:{
    type:String,
    required:[true,"enter gender"]
},
location:{
    type:String,
    required:[true,"enter location"]
},
bio:{
    type:String,
    // required:[true,"enter bio"]
},
interests:{
    type:[String],
    // required:[true,"enter at Least one Interest"]
},
images:{
    type:[String],
    // required:[true,"Enter atleast one image"]
},
socialProfile:{
    musicTaste:[''],
    favoriteBars:[''],
    default:[]
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,"Please enter the user id"]
}

})

const UserProfile=mongoose.model("UserProfile",UserProfileSchema)
module.exports=UserProfile