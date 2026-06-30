import {useState,useEffect,useRef} from "react";
import {useNavigate,useParams} from "react-router-dom";
import toast from 'react-hot-toast';
import axios from '../api/axios';
import socket from '../socket';
import "../css/Trackorder.css";
import OrderProgress from "../components/trackorder/OrderProgress";
import OrderDetails from "../components/trackorder/OrderDetails";
import DeliveredActions from "../components/trackorder/DeliveredActions";
import {Receipt,CheckCircle,ChefHat,Bike,PartyPopper,Ban} from "../constants/icons";

export const STATUS_STEPS = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Receipt,
    desc: "Your order has been received",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle,
    desc: "Restaurant confirmed your order",
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
    desc: "Your food is being prepared",
  },
  {
    key: "out_for_delivery",
    label: "Out For Delivery",
    icon: Bike,
    desc: "Your order is on the way",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: PartyPopper,
    desc: "Order delivered successfully",
  },
];

export default function TrackOrder() {
    const {orderid } = useParams();
    const [status,setstatus] = useState('Placed');
    const [load,setload] = useState(true);
    const navigate = useNavigate();
    const intid = useRef(null);
    const [order,setorder] = useState(null);

    useEffect(()=>{
        fetchorder();

        
    },[]);

    useEffect(()=>{
      socket.connect();
        socket.emit('joiOrder',orderid);

        socket.on('orderStatusUpdate',({orderId, status: newStatus})=>{
          if(orderId!==orderid) return;
          setstatus(newStatus);

          if(newStatus === 'delivered'){
            toast.success('Your order has been delivered!');
            socket.disconnect();
          }

          if(newStatus === 'cancelled'){
            toast.error('Your order was cancelled');
            socket.disconnect();
          }
        });

        return ()=>{
          socket.off('orderStatusUpdate');
          socket.disconnect();
        }
    },[orderid]);

    useEffect(()=>{
        if(!order) return;

        if(status==='delivered'||status==='cancelled'){
            return;
        }

        intid.current = setInterval(poll,5000);

        return ()=>clearInterval(intid.current);
    },[order,status]);


    const fetchorder = async ()=>{
      try{  const res = await axios.get(`/orders/${orderid}`);
        setorder(res.data);
        setstatus(res.data.status);
       }
        catch(err){
            console.log(err);
            toast.error(`canot fetch order details => ${err}`);
        }
        finally{
            setload(false);
        }
    }

    const poll = async ()=>{
        try{
        const res = await axios.get(`/orders/${orderid}/status`);
        let newstatus = res.data.status;
         setstatus(newstatus);
         if (newstatus === 'delivered') {
           clearInterval(intid.current);
         toast.success('Your order has been delivered!');
        }
         if (newstatus === 'cancelled') {
         clearInterval(intid.current);
          toast.error('Your order was cancelled');
         }
    } catch (err) {
      console.log(err);
    }
    }

      const currentStepIndex =
    STATUS_STEPS.findIndex(
      (step) => step.key === status
    );

  const currentStep =
    STATUS_STEPS.find(
      (step) => step.key === status
    );

  if (load) {
    return <h2>Loading...</h2>;
  }

  if (!order) {
    return <h2>Order not found</h2>;
  }

  const cancelOrder = async () => {
  try {
    const res = await axios.patch(
      `/orders/${orderid}`
    );

    setstatus("cancelled");

    toast.success(
      res.data.msg || "Order cancelled"
    );

  } catch (err) {
    toast.error(
      err.response?.data?.msg ||
      "Failed to cancel order"
    );
  }
};

   if (status === 'cancelled') {
    return (
      <div className="track-page">
        <div className="track-cancelled">
          <span><Ban size={18} /></span>
          <h2>Order Cancelled</h2>
          <p>Your order has been cancelled.</p>
          <button onClick={() => navigate('/')}>Order again</button>
        </div>
      </div>
    );
  }


  return (
    <div className="track-page">
      <div className="track-header">
        <div className="track-header-upper">
         
          <h1>Track Order</h1>

          <p>
            Order #
            {order._id
              .slice(-6)
              .toUpperCase()}
          </p>
           </div>
        <div className="track-header-down">
            <button className="track-cancel-btn"
          onClick={() =>
            navigate("/")
          }
        >
          Home
        </button>

        {["placed", "confirmed", "preparing"].includes(status) && (
          <button
              className="track-cancel-btn"
              onClick={cancelOrder}
            >
             Cancel Order
          </button>
          )}
       
        </div>
       
       
      </div>

      <OrderProgress
        status={status}
        currentStep={currentStep}
        currentStepIndex={
          currentStepIndex
        }
        steps={STATUS_STEPS}
      />

      <OrderDetails
        order={order}
      />

      {status ===
        "delivered" && (
        <DeliveredActions
          restaurantId={
            order.restaurant._id
          }
        />
      )}

    </div>
  )
}
