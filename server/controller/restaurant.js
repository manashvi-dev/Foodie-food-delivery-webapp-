const Restaurant = require("../models/restaurant");
const {cloudinary} = require("../config/cloudy");
const Menu = require("../models/menu");



module.exports.getAllRestaurant = async (req,res) =>{

    const {search} = req.query;
    const filter = {isOpen:true};

    if(search){
        const menus = await Menu.find({
            name:{
                $regex:search,
                $options:"i"
            }
        }).select("restaurant");

        const restId = [
            ...new Set(
                menus.map(menu=>menu.restaurant.toString())
            )
        ];

        filter.$or = [
            { name:{$regex:search,$options:"i"}},
            { _id: {$in:restId}}
        ]
    }

    const restaurants = await Restaurant.find(filter);
    res.json(restaurants);
};


/* get restaurant */
module.exports.getRestaurant = async (req,res)=>{
    const {id} = req.params;

    const rest = await Restaurant.findById(id).populate("owner","-password");

    if(!rest){
        return res.status(400).json({msg:"restaurant does not exist"});
    }

    const menu = await Menu.find({restaurant:id});

    res.json({rest,menu});

}

/*create restaurant*/

module.exports.createRestaurant = async (req,res)=>{
    const {name,address,lat,lng} = req.body;

    const exist = await Restaurant.findOne({owner:req.user.id});
    if(exist){
       return res.status(403).json({msg:"u already own one"});
    }

    let image= {};
    if(req.file){
        image = {
            url:req.file.path,
            filename:req.file.filename
        };
    }

    const restaurant = new Restaurant({
        name,address,
        location:{
            lat:parseFloat(lat),
            lng:parseFloat(lng)
        },
        image,
        owner: req.user.id
    });

    await restaurant.save();
    res.status(201).json(restaurant);
}


/* update restaurant detail */

module.exports.updateRestaurant = async (req,res)=>{
    const {id} = req.params;

    const rest= await Restaurant.findById(id);
    if(!rest){
        return res.status(404).json({msg:"Restaurant not found"});
    }

    if(rest.owner.toString()!==req.user.id){
        return res.status(403).json({msg:"User is not authorised"});
    }

    const {name,address,lat,lng} = req.body;

    if (name)    rest.name    = name;
    if (address) rest.address = address;
    if (isOpen !== undefined) rest.isOpen = isOpen;
    if (lat && lng) rest.location = { lat: parseFloat(lat), lng: parseFloat(lng) };

    if(req.file){
        if(rest.image?.filename)
             await cloudinary.uploader.destroy(rest.image.filename);

        rest.image = {
            url:req.file.path,
            filename:req.file.filename
        }
    }

    await rest.save();
    res.json(rest);

}


/* delete restaurant */

module.exports.deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ msg: "Restaurant not found" });

  if (restaurant.owner.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not authorized" });

  if (restaurant.image?.filename)
    await cloudinary.uploader.destroy(restaurant.image.filename);

  const items = await Menu.find({restaurant:req.params.id});
  if(items && items.length){

  for(let item of items){
    if(item.image && item.image.filename){
        await cloudinary.uploader.destroy(item.image.filename);
    }
  }

  await Menu.deleteMany({restaurant:req.params.id});
}
  await restaurant.deleteOne();
  res.json({ msg: "Restaurant deleted successfully and all related files have been deleted" });
};


/* update rating */

module.exports.rateRestaurant = async (req,res)=>{
    const {id} = req.params;
    const {rating} = req.body;

    if(!rating || rating<1 || rating>5){
        return res.status(400).json({msg:"Rating must be between 1 and 5"});
    }

    const rest = await Restaurant.findById(id);
    if(!rest) return res.status(404).json({ msg: "Restaurant not found" });

    if(rest.owner.toString()===req.user.id){
        console.log(rest.owner.toString());
        console.log(req.user.id);
        return res.status(403).json({msg:"Owner can't rate"});
    }

    const newrate = rest.rating === 0 ? rating : parseFloat(((rest.rating + rating)/2).toFixed(1));

    rest.rating = newrate;
    await rest.save();

    res.json({rating:rest.rating});
}

module.exports.myrestaurant =  async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user.id });
  res.json(restaurant);
};