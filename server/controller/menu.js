const Menu = require("../models/menu");
const {cloudinary} = require("../config/cloudy");
const Restaurant = require("../models/restaurant");

const isOwner = async (rId, userId) => {
    const rest = await Restaurant.findById(rId);

    if (!rest)
        return { error: "Restaurant not found", status: 404 };

    if (rest.owner.toString() !== userId)
        return { error: "Not authorized", status: 403 };

    return { rest };
};

module.exports.getMenu = async (req,res)=>{

    const {rId} = req.params;
   
    const menu = await Menu.find({restaurant:rId});
    if(!menu){
        return res.status(403).json("menu is not available");
    }

    res.json(menu);
};


module.exports.addMenuItem = async (req,res)=>{
    const {rId} = req.params;
    console.log(req.params);
    console.log(rId);
    const {name,description,price,category} = req.body;

    const check = await isOwner(rId,req.user.id);

    if(check.error){
        return res.status(check.status).json({ msg: check.error });
    }

    let image = {};
    if(req.file){
        image = {
            url:req.file.path,
            filename:req.file.filename
        }
    }

    const item = await Menu.create({
        name,description,
        price:parseFloat(price),
        category,
        image,
        restaurant:rId
    });

    res.status(201).json(item);
};


module.exports.updateMenuItem = async (req,res)=>{
    const {rId,itemId} = req.params;
    const {name,description,price,category,isAvailable} = req.body;

    const item = await Menu.findById(itemId);

    if(!item){
        return res.status(400).json({msg:"item does not exist"});
    }

     const check = await isOwner(rId, req.user.id);
     if (check.error) 
        return res.status(check.status).json({ msg: check.error });

      
    if (item.restaurant.toString() !== rId)
    return res.status(400).json({ msg: "Menu item does not belong to this restaurant" });

    if (name)        item.name        = name;
    if (description) item.description = description;
    if (price)       item.price       = parseFloat(price);
    if (category)    item.category    = category;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    if(req.file){
        if(item.image?.filename){
            await cloudinary.uploader.destroy(item.image.filename);
        }
    }

    await item.save();
    res.json(item);

}

module.exports.deleteMenuItem = async (req,res)=>{
    const {rId,itemId} = req.params;

     const item = await Menu.findById(itemId);

    if(!item){
        return res.status(400).json({msg:"item does not exist"});
    }

     const check = await isOwner(rId, req.user.id);
     if (check.error) 
        return res.status(check.status).json({ msg: check.error });

      
    if (item.restaurant.toString() !== rId)
    return res.status(400).json({ msg: "Menu item does not belong to this restaurant" });

    if(item.image?.filename){
            await cloudinary.uploader.destroy(item.image.filename);
        }

     await item.deleteOne();
     res.json({msg:"Menu item deleted"});   

}