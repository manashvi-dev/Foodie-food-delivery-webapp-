const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(user){
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'2d'});
}

module.exports.usersignup = async (req,res)=>{
    const {name,email,password,phone,address,role} = req.body;
     
    const exist = await User.findOne({email});

    if(exist){
        return res.status(409).json({msg:"user already registered"});
    }

    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({
        name,email,
        password:hashed,
        phone,
        role:role||'customer',
        address
    });

    const token = generateToken(user);

     res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address:user.address}
  });  
};


module.exports.userlogin = async (req,res)=>{
    const {email,password} = req.body;

  try{  const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({msg:"user not registered yet"});
    }

    const ismatch = await bcrypt.compare(password,user.password);

    if(!ismatch){
        return res.status(400).json({msg:"incorrect password"});
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address:user.address}
    });
}
    catch(err){
        res.status(400).JSON({msg:err});
    }

}


module.exports.userDetail = async (req,res)=>{
    const {id,role} = req.user;
    const detail  = await User.findById(id);

    if(!detail){
        return res.status(400).json({msg:"user does not exist"});
    }

    return res.status(200).json(detail);
}