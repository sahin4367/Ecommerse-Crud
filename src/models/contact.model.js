import mongoose from "mongoose";

contactSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true},
    message : {type : String , required : true},
    phone : {type : String , required : true}
})

export const Contact = mongoose.model("Contact" , contactSchema);