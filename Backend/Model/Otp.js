import { model, Schema } from "mongoose";


const OtpSchema = new Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    otpHash:{
        type:String,
        required:[true,"OTP Hash is required"]
    },
    type: {
        type: String,
        enum: ["signup", "reset"],
        default: "signup"
    },
     userName: {
         type: String
         },
     hashedPassword: { 
        type: String 
    },
    expiresAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000, 
  },
},{timestamps:true})

const otpModel = model("otp",OtpSchema);

export default otpModel;