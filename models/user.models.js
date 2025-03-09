import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
      type:String,
      required:true
    },
    country:{
      type:"String",
      required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    reqest:{
        type: Array
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date

}, {timestapmps:true})
export const User = mongoose.model('User', userSchema);