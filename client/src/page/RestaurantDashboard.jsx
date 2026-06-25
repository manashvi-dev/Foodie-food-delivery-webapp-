import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import '../css/restaurant/Dashboard.css';
import OrderCard from "../components/restaurantdashboard/OrderCard";
import MenuTab from '../components/restaurantdashboard/MenuTab';
import RestaurantHero from '../components/restaurant/RestaurantHero';
import { STATUS_COLORS } from '../constants/orderStatus';

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [ordersRes, restRes] = await Promise.all([
        axios.get('/orders/restaurant'),
        axios.get('/restaurants/mine'),
      ]);
      setOrders(ordersRes.data);
      setRestaurant(restRes.data);
      if (restRes.data?._id) {
        const menuRes = await axios.get(`/restaurants/${restRes.data._id}/menu`);
        setMenu(menuRes.data);
      }
    } catch (err) {
      //console.log(err?.response?.data);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  // ── Order actions ──────────────────────────────────────
  async function updateStatus(orderId, status) {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status } : o)
      );
      toast.success(`Order ${status}`);
    } catch (err) {
      console.log(err.response?.data)
      toast.error(err.response?.data?.msg || 'Failed to update');
    }
  }

  // ── Menu actions ───────────────────────────────────────
  async function deleteMenuItem(itemId) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`/restaurants/${restaurant._id}/menu/${itemId}`);
      setMenu((prev) => prev.filter((m) => m._id !== itemId));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  }

  async function toggleAvailability(item) {
    try {
      const res = await axios.put(
        `/restaurants/${restaurant._id}/menu/${item._id}`,
        { isAvailable: !item.isAvailable }
      );
      setMenu((prev) => prev.map((m) => m._id === item._id ? res.data : m));
    } catch (err) {
      console.log(err?.response);
      toast.error('Failed to update');
    }
  }

  // ── Filter orders ──────────────────────────────────────
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const orderCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <p className="dash-loading">Loading dashboard...</p>;

   const handledelete = async () => {
    try {
      await axios.delete(`/restaurants/${restaurant._id}`);
      toast.success("Restaurant deleted successfully");
      navigate("/");
    } catch(err) {
      toast.error(err.response?.data?.msg || "Deletion unsuccessful");
    }
  };

  return (
    <div className="dash-page">
       
        <div className='restdashboard-pageleft'>
                <RestaurantHero restaurant={restaurant} menu={menu}/>
             <div className="rest-body">
                 <div className="owner-action">
                   <button
                     className="owner-add-btn"
                     onClick={() => navigate(`/restaurants/${restaurant?._id}/addMenu`)}
                   >
                     + Add Menu
                   </button>
                   <button className="owner-add-btn" onClick={handledelete}>
                     Delete
                   </button>
                   <button className='owner-add-btn' onClick={()=>navigate(`/restaurants/edit/${restaurant?._id}`)}>
                     Edit
                   </button>
                 </div>
             </div>
        </div>
      {/* ── Header ──────────────────────────────────── */}
      <div className="restdashboard-pageright">
      <div className="dash-header">
        <div>
          <p className="dash-sub">Restaurant Dashboard</p>
        </div>
        
      </div>

      {/* ── Stats ───────────────────────────────────── */}
      <div className="dash-stats">
        {[
          { label: 'Total orders',   value: orders.length },
          { label: 'New orders',     value: orderCounts['placed'] || 0 },
          { label: 'Preparing',      value: orderCounts['preparing'] || 0 },
          { label: 'Delivered today',value: orderCounts['delivered'] || 0 },
        ].map((stat) => (
          <div key={stat.label} className="dash-stat-card">
            <p className="dash-stat-label">{stat.label}</p>
            <p className="dash-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────── */}
      <div className="dash-tabs">
        <button
          className={`dash-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders {orders.length > 0 && <span className="dash-tab-badge">{orders.length}</span>}
        </button>
        <button
          className={`dash-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu {menu.length > 0 && <span className="dash-tab-badge">{menu.length}</span>}
        </button>
      </div>
{/* ── Orders tab ──────────────────────────────── */}
{activeTab === 'orders' && (
  <div className="dash-orders">

    {/* filter bar */}
    <div className="dash-filter-bar">
      {['all', 'placed', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((f) => (
        <button
          key={f}
          className={`dash-filter-btn ${filter === f ? 'active' : ''}`}
          onClick={() => setFilter(f)}
        >
          {f === 'all' ? 'All' : STATUS_COLORS[f]?.label}
          {f !== 'all' && orderCounts[f] > 0 && (
            <span className="dash-filter-count">{orderCounts[f]}</span>
          )}
        </button>
      ))}
    </div>

    {filteredOrders.length === 0 ? (
      <p className="dash-empty">No orders found.</p>
    ) : (
      <div className="dash-order-list">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            updateStatus={updateStatus}
          />
        ))}
      </div>
    )}
  </div>
)}

{/* ── Menu tab ──────────────────────────────── */}
{activeTab === 'menu' && (
  <MenuTab
    menu={menu}
    restaurant={restaurant}
    toggleAvailability={toggleAvailability}
    deleteMenuItem={deleteMenuItem}
  />
)}
</div>
    </div>
  );
}
