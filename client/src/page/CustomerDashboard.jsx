import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import '../css/CustomerDashboard.css';
import {Mail,Phone,MapPin,XCircle,CheckCircle,Receipt,RefreshCcw} from "../constants/icons";
import CustOrderCard from '../components/customerDashboard/CustOrderCard';


export default function CustomerDashboard() {
   const navigate = useNavigate();

   const [profile,setprofile] = useState(null);
   const [orders,setorders] = useState([]);
   const [loading,setloading] = useState(true);
   const [activetab,setactivetab] = useState('all');

   useEffect(()=>{
     fetchAll();
   },[]);

   async function fetchAll(){
     try{const [profileRes,orderRes] = await Promise.all([
        axios.get('/user/auth/me'),
        axios.get('/orders/myorders')
     ]);

     setprofile(profileRes.data);
     setorders(orderRes.data);
    }catch(err){
        toast.error(err?.response?.data?.msg || "failed to load dashboard");
    }
    finally{
        setloading(false);
    }

   }

   async function cancelorder(orderId){
    if (!window.confirm('Cancel this order?')) return;
    try{
        await axios.patch(`/orders/${orderId}`);
        setorders((prev)=>
          prev.map((o)=> 
         o._id==orderId ? {...o,status:'cancelled'}:o
        ));

        toast.success("order cancelled");
    }
    catch(err){
        toast.error(err.response?.data?.msg ||"cannot cancel order");
    }
   }


   const filterOrders = {
    all:orders,
    active: orders.filter((o)=>(o.status !== 'delivered' && o.status!=='cancelled')),
    delivered: orders.filter((o)=>o.status === "delivered"),
    cancelled: orders.filter((o)=>o.status === "cancelled")
   }

    let stats = [
        {
    label: "Total Orders",
    value: orders.length,
    icon: Receipt,
    },
   {
    label: "Active",
    value: filterOrders.active.length,
    icon: RefreshCcw,
   },
   {
    label: "Delivered",
    value: filterOrders.delivered.length,
    icon: CheckCircle,
   },
   {
    label: "Cancelled",
    value: filterOrders.cancelled.length,
    icon: XCircle,
    },
   ];
    
   if (loading) {
    return (
      <div className="cust-page">
        <div className="cust-loading">
          <div className="cust-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <>
    <div className="cust-page">
        {/* Profile section */}
      <div className="cust-top-section">
       <div className="cust-profile-section">
         {/* avatr */}
         <div className="cust-avatar-wrap">
            <div className="cust-avatar">
                {profile?.name.charAt(0).toUpperCase()}
            </div>
            <div className="cust-avatar-ring"/>
         </div>

         {/*info*/}
         <div className="cust-profile-info">
            <div className="cust-profile-top">
                <h1>{profile?.name}</h1>
                <span className='cust-role-badge'>Customer</span>
            </div>

            <div className="cust-profile-details">
                <div className="cust-detail-item">
                  <span className="cust-detail-icon"><Mail size={15}/></span>
                  <span>{profile?.email}</span>                    
                </div>

                <div className="cust-detail-item">
                  <span className="cust-detail-icon"><Phone size={15}/></span>
                  <span>{profile.phone}</span>
                </div>

                <div className="cust-detail-item">
                  <span className="cust-detail-icon"><MapPin size={15}/></span>
                  <span>{profile.address}</span>
              </div>
            </div>
         </div>

         {/* Browse button */}
         <button className="cust-order-now-btn" onClick={()=>navigate('/')}> + Order Food</button>
       </div>

       {/* Stats */}
       <div className="cust-stats">
        {
           stats.map((stat)=>{
             const Icon = stat.icon;
             return (
            <div key={stat.label} className="cust-stat-card">
              <span className="cust-stat-icon"><Icon size={15}/></span>
              <p className="cust-stat-value">{stat.value}</p>
              <p className="cust-stat-label">{stat.label}</p>
            </div>
             );
         })
        }
       </div>
      </div>
       {/*order section */}

       <div className="cust-orders-section">
         <div className="cust-orders-header">
            <h2>My Orders</h2>
         </div>

         { /* Tabs */}

         <div className="cust-tabs">
            {[
               { key: 'all',       label: 'All' },
               { key: 'active',    label: 'Active' },
               { key: 'delivered', label: 'Delivered' },
               { key: 'cancelled', label: 'Cancelled' },
            ].map((tab)=> (
                <button key={tab.key} className={`cust-tab ${activetab === tab.key ? 'active' : ''}`}
                onClick={()=>setactivetab(tab.key)}>
                     {tab.label}
                     {filterOrders[tab.key].length > 0 && (
                        <span className="cust-tab-count">
                        {filterOrders[tab.key].length}
                       </span>
                     )}
                </button>
            ))}
         </div>

         {/*order list*/}

         {
            filterOrders[activetab].length === 0 ? (
                <div className="cust-empty">
                    <span></span>
                    <p>No {activetab === 'all' ? '' : activetab} orders yet.</p>
                    <button className='cust-order-now-btn' onClick={()=>navigate('/')}>order now</button>   
                </div>
            ): (
                <div className="cust-order-list">
                    {
                        filterOrders[activetab].map((order)=>(
                            <CustOrderCard key={order._id} order={order} ontrack={()=>navigate(`/orders/${order._id}/track`)}
                              oncancel={cancelorder} onreorder={()=>navigate(`/restaurants/${order.restaurant?._id}`)}/>
                        ))
                    }
                </div>
            )
         }

       </div>
    </div>
      
    </>
  )
}
