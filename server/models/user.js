const mongoose = require("mongoose");


const userschema = new mongoose.Schema({
    name:{
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
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum: ['customer', 'restaurant', 'agent'],
        default:"customer"
    },   
} ,{ timestamps: true });


const User = mongoose.model("User",userschema);

module.exports = User;