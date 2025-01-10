const mongoose = require('mongoose');

const VenueManagement=mongoose.Schema(
    {
        venueName:{
            type:String,
            required:[true,"Please enter the venue name"]
        },
        location:{
            type:String,
            required:[true,"Please enter the venue location"]
        },
        normalEntranceFee:{
            type:Number,
            required:[true,"Please enter normal entrance fee"]
        },
        VIPEntranceFee:{
            type:Number,
            require:[true,"please Enter VIP entrance fee"]
        },
        minimumAge:{
            type:Number,
            default:18
        },
        currentEvent:{
            type:String,
            default:''
        },
        rating:{
            type:Number,
            default:0
        },
        images:{
            type:[String],
            // require:[true,"please Enter atleast one image"]
            default:[]
            
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:[true,"Please enter the user id"]
        },
        description:{
            type:String,
            default:''
        },
        openingHours:{
            type:String,
            default:''
        },
        specialities:{
            type:[String],
            default:[]
        }
    },{
        timestamps:true
    }
)

const Event=mongoose.model("Event",VenueManagement)
module.exports=Event