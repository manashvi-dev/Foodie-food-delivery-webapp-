import { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "../css/Cart.css";
import toast from 'react-hot-toast';
import axios from '../api/axios';


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cart,setcart] = useState(JSON.parse(localStorage.getItem('cart'))||[]);
  
  const navigate = useNavigate();


  const [address, setAddress] = useState("");

  useEffect(()=>{
      let cart = JSON.parse(localStorage.getItem('cart'))||[];

      let data = cart.map((item)=>({
         id:item._id,
        name:item.name,
        price:item.price,
        quantity:item.quantity,
        image:item.image.url,
      }))

      setCartItems(data);
  },[]);

  useEffect(()=>{
     localStorage.setItem('cart', JSON.stringify(cart));
  },[cart])

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    setcart((prev)=> 
        prev.map((item)=> item._id===id 
              ? {...item,quantity:item.quantity +1} : item));
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    setcart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
 const gst = subtotal * 0.18;
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee + gst;

  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error("address required");
      return;
    }

    try{
    let data = cart.map((item)=>({
        menuItem:item._id,
        price:item.price,
        quantity:item.quantity
      }));
      const response = await axios.post("/orders",{
         restaurant: cart[0].restaurantId,
         items:data,
         totalAmt:total,
          deliveryAdd:address
      });
   console.log(response);
    localStorage.removeItem("cart");
    toast.success("Order Placed Successfully!");
    navigate(`/orders/${response?.data}/track`);
     
    }catch(err){
      console.log(err.response?.data);
    console.log(err);

    toast.error(
        err.response?.data?.msg || "Failed to place order"
    );
    }
  };

  return (
    <div className="cart-container">
      <h1>My Cart</h1>

      {cartItems.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-card" key={item.id}>
               <img src={item.image}/>
               
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
               <div className="deliveryitem">
                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQty(item.id)}>
                    +
                  </button>
                  
                </div>
               <div className="each-item-price">
                   <h3>₹{item.price * item.quantity}</h3>
                </div>
                
                   </div>
                
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>GST</span>
              <span>₹{gst}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <div className="deliveryaddress">
            <label htmlFor="deliveryaddress">Address</label>
            <textarea
            id="deliveryaddress"
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            </div>
            <button
              className="place-order-btn"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
