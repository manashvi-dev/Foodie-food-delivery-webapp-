const mongoose = require("mongoose");


const restschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   address:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String
    },
    rating:{
        type:Number,
        default:0,
        min:0,max:5
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    owner:{
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true,
      unique:true 
    },
    location:{
        lat:{type:Number},
        lng:{type:Number},
    },
    
},{timestamps:true});


const Restaurant = mongoose.model("Restaurant",restschema);

module.exports = Restaurant;