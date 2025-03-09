import mongoose from "mongoose"

const agentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    country: {
        type: "String",
        // required: true
    },
    state:{
        type: "String"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    nin: {
        type: String,
        // required: true
    },
    image: {
        data: {
          type: Buffer, // Store image data as a buffer
          
        },
        contentType: {
          type: String,
       
        },
        name: {
          type: String,
        
        },
        url: {
          type: String,
        
        }
        ,
    },
    verified: {
        type: Boolean,
        default: false
    },
    area: {
        type: Array,
        // required: true
    },
    touringFee:{
        type:String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    hasBeenDisplayed: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date

}, { timestapmps: true })
export const Agent = mongoose.model('Agent', agentSchema);