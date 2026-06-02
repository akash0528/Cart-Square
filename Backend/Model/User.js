import { Schema , model } from "mongoose";

const UserSchema = new Schema({
    googleId:{
        type:String,
        unique:true,
         sparse: true
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
       
    },
    avatar:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const User = model("user",UserSchema)

export default User;