
const mongoose=require('mongoose')
const SupportSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name"]
    },
    subject:{
        type:String,
        required:[true,"Please enter a subject"]
    },
    message:{
        type:String,
        required:[true,"Please enter a message"]
    },
    phone:{
        type:String,
        required:[true,"please enter the phoneNumber"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:{
            validator:function(v){
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message:"Please enter a valid email address"
        }
    }
},{
    timestamps:true
}
)

const Support=mongoose.model("Support",SupportSchema)
module.exports=Support