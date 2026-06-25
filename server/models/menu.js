const mongoose = require("mongoose");

const menuschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
       url:String,
       filename:String
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
   restaurant:   {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant',
        required: true }
        
}, { timestamps: true });


const Menu = mongoose.model("Menu",menuschema);

module.exports = Menu;