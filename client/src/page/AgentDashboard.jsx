import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import socket from "../socket";
import "../css/AgentDashboard.css";
import AgentCard from '../components/agentDashboard/AgentCard';
import AgentHeader from '../components/agentDashboard/AgentHeader';

export default function AgentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {

    socket.connect();

    socket.emit("joinAgent", user.id);

    socket.on("orderAvailable", (order) => {

        setOrders(prev => [order, ...prev]);

        toast.success("🛵 New order available!");

    });

    socket.on("orderPickedUp", ({ orderId }) => {

        setOrders(prev =>
            prev.map(order =>
                order._id === orderId
                    ? { ...order, status: "out_for_delivery" }
                    : order
            )
        );

    });

    socket.on("orderDelivered", ({ orderId }) => {

        setOrders(prev =>
            prev.map(order =>
                order._id === orderId
                    ? { ...order, status: "delivered" }
                    : order
            )
        );

    });

    return () => {

        socket.off("orderAvailable");
        socket.off("orderPickedUp");
        socket.off("orderDelivered");

        socket.disconnect();

    };

}, []);

  async function fetchOrders() {
    try {
       setLoading(true);
      const res = await axios.get('/orders/agent/allOrders');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status, agent: user.id }
            : o
        )
      );
      toast.success(
        status === 'out_for_delivery'
          ? 'Order picked up!'
          : 'Order delivered!'
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update');
    }
  }

  // ── Split orders into tabs ─────────────────────────────
  const availableOrders = orders.filter(
    (o) => ['confirmed', 'preparing'].includes(o.status) && !o.agent
  );

  const myOrders = orders.filter(
    (o) => o.agent && (
      typeof o.agent === 'string'
        ? o.agent === user.id
        : o.agent._id === user.id
    )
  );
  const deliveredOrders = myOrders.filter((o) => o.status === 'delivered');
  const activeOrders    = myOrders.filter((o) => o.status !== 'delivered');

  if (loading) return <p className="agent-loading">Loading orders...</p>;

  return (
    <div className="agent">
    <div className="agent-page">
       <AgentHeader fetchOrders={fetchOrders} user={user}/>
        {/* ── Stats ── */}
      <div className="agent-stats">
        {[
          { label: 'Available orders', value: availableOrders.length },
          { label: 'My active orders', value: activeOrders.length },
          { label: 'Delivered today',  value: deliveredOrders.length },
          { label: 'Total delivered',  value: deliveredOrders.length },
        ].map((stat) => (
          <div key={stat.label} className="agent-stat-card">
            <p className="agent-stat-label">{stat.label}</p>
            <p className="agent-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
      

      {/* ── Tabs ────────────────────────────────────── */}
      <div className="agent-tabs">
        <button
          className={`agent-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available
          {availableOrders.length > 0 && (
            <span className="agent-tab-badge">{availableOrders.length}</span>
          )}
        </button>
        <button
          className={`agent-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          My Active
          {activeOrders.length > 0 && (
            <span className="agent-tab-badge">{activeOrders.length}</span>
          )}
        </button>
        <button
          className={`agent-tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
      </div>

      {/* ── Available orders ─────────────────────────── */}
      {activeTab === 'available' && (
        <div className="agent-orders">
          {availableOrders.length === 0 ? (
            <div className="agent-empty">
              <span>📭</span>
              <p>No available orders right now.</p>
              <button className="agent-refresh-btn" onClick={fetchOrders}>
                Refresh
              </button>
            </div>
          ) : (
            availableOrders.map((order) => (
              <AgentCard
                key={order._id}
                order={order}
                tab="available"
                onUpdate={updateStatus}
              />
            ))
          )}
        </div>
      )}

      {/* ── My active orders ─────────────────────────── */}
      {activeTab === 'active' && (
        <div className="agent-orders">
          {activeOrders.length === 0 ? (
            <div className="agent-empty">
              <span>✅</span>
              <p>No active orders. Pick one from Available tab.</p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <AgentCard
                key={order._id}
                order={order}
                tab="active"
                onUpdate={updateStatus}
              />
            ))
          )}
        </div>
      )}

      {/* ── Delivered orders ─────────────────────────── */}
      {activeTab === 'delivered' && (
        <div className="agent-orders">
          {deliveredOrders.length === 0 ? (
            <div className="agent-empty">
              <span>📦</span>
              <p>No delivered orders yet.</p>
            </div>
          ) : (
            deliveredOrders.map((order) => (
              <AgentCard
                key={order._id}
                order={order}
                tab="delivered"
                onUpdate={updateStatus}
              />
            ))
          )}
        </div>
      )}

    </div>
    </div>
  );
}
