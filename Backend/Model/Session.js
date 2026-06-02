import {Schema , model} from "mongoose";

const sessionSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"]
    },
    refreshTokenHash:{
        type:String,
        required:[true,"Refresh Token hash is required"]
    },
    ip:{
        type:String,
        required:[true,"IP Address is Required"]
    },
    userAgent:{
        type:String,
        required:[true,"User Agent is required "]
    },
    revoked:{
        type: Boolean,
        default : false

    }
},{timestamps:true})

const session = model("session",sessionSchema)

export default session;