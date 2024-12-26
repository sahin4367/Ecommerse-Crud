import mongoose from "mongoose";

const subscripeSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: false
    },
    codeExpireAt: {
        type: Date,
        required: false
    }
} ,{timestamps : true})            


export const Subscripe = mongoose.model('Subscripe', subscripeSchema);