const Order = require("../models/order");
const Restaurant = require("../models/restaurant");


module.exports.placeorder = async (req,res) =>{
    const {restaurant,items,totalAmt,deliveryAdd} = req.body;
    const customer = req.user.id;
    const rest = await Restaurant.findById(restaurant);
     if(!rest){
        return res.status(403).json({msg:"restaurant not found"});
    }

    if(!items || items.length===0){
        return res.status(400).json({msg:"item not selected"});
    }

    if(deliveryAdd.trim()===''){
         return res.status(400).json({msg:"choose address"});
    }

    if (!rest.isOpen) return res.status(400).json({ msg: "Restaurant is currently closed" });

    const orderobj = {restaurant,items,totalAmt,deliveryAdd,customer};
    const order = new Order(orderobj);
    await order.save();

    return res.status(200).json(order._id );

}


module.exports.getorder = async (req,res)=>{
    const {orderid} = req.params;
   console.log("orderid = ",orderid);
    const item = await Order.findById(orderid)
                 .populate("restaurant","name image address rating isOpen")
                 .populate("items.menuItem","name image");
      console.log(item);           
    if(!item){
        return res.status(404).json({msg:"item does not exist"});
    }

    if(item.customer.toString()!==req.user.id){
        return res.status(403).json({msg:"u r not authorized"});
    }

    return res.status(200).json(item);
}


module.exports.orderstatus = async (req,res)=>{
    const {orderid} = req.params;

    const order = await Order.findById(orderid);

    if(!order){
        return res.status(400).json({msg:"order does not exist"});
    }

    if(order.customer.toString()!==req.user.id){
        return res.status(403).json({msg:"u r not authorised"});
    }

    return res.status(200).json({status: order.status});
}

module.exports.myorders = async (req,res)=>{
    const id = req.user.id;

    const order = await Order.find({customer:id})
                .populate("restaurant","name image address")
                .populate("items.menuItem","name image")
                .sort({ createdAt: -1 });

    return res.status(200).json(order);            
}

module.exports.cancel = async (req,res)=>{
   const {orderid} = req.params;

   const order = await Order.findById(orderid);

   if(!order){
    return res.status(400).json({msg:"order does not exist"});
   }

   if(order.customer.toString()!==req.user.id){
        return res.status(403).json({msg:"u r not authorised"});
   }

    if(["out_for_delivery","delivered"].includes(order.status)){
        return res.status(403).json({msg:"order can't be cancelled"});
    }
   order.status = "cancelled";
   order.save();

   return res.status(200).json({msg:"order cancelled",status:order.status});
}


module.exports.restaurantorders = async (req, res) => {
    const id = req.user.id;

    const rest = await Restaurant.findOne({
        owner: id
    });

    // No restaurant => no orders
    if (!rest) {
        return res.status(200).json([]);
    }

    const orders = await Order.find({
        restaurant: rest._id
    })
    .populate("customer", "name phone")
    .populate("items.menuItem", "name price")
    .sort({ createdAt: -1 });

    return res.status(200).json(orders);
};


module.exports.agentorders = async (req,res)=>{
    const orders = await Order.find({
        $or:[{
            status:{$in:["preparing","confirmed"]},agent:null
        },
            {agent:req.user.id}
         ]
    }).populate("customer","name phone")
    .populate("restaurant","name address")
    .populate("items.menuItem","name")
    .sort({createdAt:-1});

    res.json(orders);
}


module.exports.updatestatus = async (req,res)=>{
    const {orderid} = req.params;
    const {status} = req.body;
    const role  = req.user.role;

    const order = await Order.findById(orderid);

    if(!order){
         return res.status(400).json({msg:"order does not exist"});
    }

    const allstatus = ["placed","confirmed","preparing","out_for_delivery","delivered","cancelled"];
    if(!allstatus.includes(status)){
        return res.status(400).json({msg:"invalid status"});
    }

    if(role==="restaurant"){
        const rest = await Restaurant.findOne({owner:req.user.id});
        if (!rest || rest._id.toString() !== order.restaurant.toString())
           return res.status(403).json({ msg: "Not authorized" });

         const reststatus= ["confirmed", "preparing", "cancelled"];
         if(!reststatus.includes(status)){
             return res.status(400).json({ msg: "Restaurant can only confirm, prepare or cancel" });
         }
    }

     if (req.user.role === "agent") {
        const allowedForAgent = ["out_for_delivery", "delivered"];
       if (!allowedForAgent.includes(status))
         return res.status(400).json({ msg: "Agent can only update to out_for_delivery or delivered" });

       if (!order.agent) order.agent = req.user.id;
     }

    order.status = status;
    await order.save();

    res.json({ msg: "Status updated", status: order.status });


}