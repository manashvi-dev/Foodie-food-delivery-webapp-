const {restaurantSchema,userSchema,orderSchema,menuSchema} = require("../joiSchema");

module.exports.validateUser = (req,res,next)=>{
    const {error} = userSchema.validate(req.body);

    if(error){
       return res.status(400).json({msg:error.details[0].message}) 
    }
    next();
}


module.exports.validateRestaurant = (req,res,next)=>{
    const {error} = restaurantSchema.validate(req.body);

    if(error){
       return res.status(400).json({msg:error.details[0].message}) 
    }
    next();
}


module.exports.validateMenu = (req,res,next)=>{
    const {error} = menuSchema.validate(req.body);

    if(error){
       return res.status(400).json({msg:error.details[0].message}) 
    }
    next();
}


module.exports.validateOrder = (req,res,next)=>{
    const {error} = orderSchema.validate(req.body);

    if(error){
       return res.status(400).json({msg:error.details[0].message}) 
    }
    next();
}