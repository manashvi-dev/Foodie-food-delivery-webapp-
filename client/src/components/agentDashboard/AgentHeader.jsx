
export default function AgentHeader({fetchOrders,user,availableOrders}) {
  return (
     <div className="agent-profile-card">

      <div className="agent-profile-left">
        <div className="agent-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{user?.name}</h2>
          <p className="agent-role">{user?.role}</p>
        </div>
      </div>

      <div className="agent-profile-info">
        <div className="info-item">
          <span>Email</span>
          <p>{user?.email}</p>
        </div>

        <div className="info-item">
          <span>Phone</span>
          <p>{user?.phone || "Not Added"}</p>
        </div>

        <div className="info-item">
          <span>Address</span>
          <p>{user?.address || "Not Added"}</p>
        </div>
      </div>

      <button
        className="agent-refresh-btn"
        onClick={fetchOrders}
      >
        ↺ Refresh
      </button>

    </div>
  )
}
