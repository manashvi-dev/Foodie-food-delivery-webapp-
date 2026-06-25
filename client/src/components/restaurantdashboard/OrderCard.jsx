import { STATUS_COLORS } from "../../constants/orderStatus";
import {User,Phone} from "../../constants/icons"

export default function OrderCard({ order, updateStatus }) {
  return (
    <div className="dash-order-card">
      <div className="dash-order-head">
        <div>
          <p className="dash-order-id">
            #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="dash-order-time">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <span
          className="dash-order-status"
          style={{
            background: STATUS_COLORS[order.status]?.bg,
            color: STATUS_COLORS[order.status]?.color,
          }}
        >
          {STATUS_COLORS[order.status]?.label}
        </span>
      </div>

     <div className="dash-order-customer" style={{display:"flex",gap:"0.5rem"}}>
         <span>
         <User size={16} />
         {order.customer?.name}
         </span>

        {order.customer?.phone && (
        <span>
         <Phone size={16} />
         {order.customer.phone}
        </span>
        )}
     </div>

      <div className="dash-order-items">
        {order.items.map((item, i) => (
          <div key={i} className="dash-order-item-row">
            <span>{item.menuItem?.name || "Item"}</span>
            <span>x{item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="dash-order-footer">
        <div>
          <p className="dash-order-address">
            Location - {order.deliveryAdd}
          </p>
          <p className="dash-order-total">
            Total: ₹{order.totalAmt?.toFixed(2)}
          </p>
        </div>

        <div className="dash-order-actions">
          {order.status === "placed" && (
            <>
              <button
                className="dash-action-btn confirm"
                onClick={() => updateStatus(order._id, "confirmed")}
              >
                ✓ Confirm
              </button>

              <button
                className="dash-action-btn cancel"
                onClick={() => updateStatus(order._id, "cancelled")}
              >
                ✕ Reject
              </button>
            </>
          )}

          {order.status === "confirmed" && (
            <button
              className="dash-action-btn prepare"
              onClick={() => updateStatus(order._id, "preparing")}
            >
              👨‍🍳 Start Preparing
            </button>
          )}

          {order.status === "preparing" && (
            <span className="dash-preparing-badge">
              👨‍🍳 Preparing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
