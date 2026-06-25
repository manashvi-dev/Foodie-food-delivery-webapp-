import { STATUS_COLORS } from "../../constants/orderStatus";
import {
  Store,
  MapPin,
  User,
  Phone,
  Bike,
  CheckCircle,
} from "lucide-react";

export default function AgentCard({ order, tab, onUpdate }) {
  return (
    <div className="agent-order-card">

      {/* Header */}
      <div className="agent-order-head">
        <div>
          <p className="agent-order-id">
            #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="agent-order-time">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <span
          className="agent-order-status"
          style={{
            background: STATUS_COLORS[order.status]?.bg,
            color: STATUS_COLORS[order.status]?.color,
          }}
        >
          {STATUS_COLORS[order.status]?.label}
        </span>
      </div>

      {/* Restaurant */}
      <div className="agent-order-restaurant">
        <Store size={18} />

        <div>
          <p className="agent-rest-name">
            {order.restaurant?.name}
          </p>

          <p className="agent-rest-address">
            <MapPin size={14} />
            {order.restaurant?.address}
          </p>
        </div>
      </div>

      {/* Customer */}
      <div className="agent-order-customer">
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

      {/* Items */}
      <div className="agent-order-items">
        {order.items.map((item, i) => (
          <div key={i} className="agent-item-row">
            <span>{item.menuItem?.name || "Item"}</span>
            <span>x{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="agent-order-address">
        <MapPin size={16} />
        <p> {order.deliveryAdd}</p>
      </div>

      {/* Total */}
      <div className="agent-order-total">
        <span>Total</span>
        <span>₹{order.totalAmt?.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="agent-order-actions">
        {tab === "available" && (
          <button
            className="agent-action-btn pickup"
            onClick={() =>
              onUpdate(order._id, "out_for_delivery")
            }
          >
            <Bike size={18} />
            Accept & Pick Up
          </button>
        )}

        {tab === "active" &&
          order.status === "out_for_delivery" && (
            <button
              className="agent-action-btn deliver"
              onClick={() =>
                onUpdate(order._id, "delivered")
              }
            >
              <CheckCircle size={18} />
              Mark as Delivered
            </button>
          )}

        {tab === "delivered" && (
          <span className="agent-delivered-badge">
            <CheckCircle size={16} />
            Delivered
          </span>
        )}
      </div>

    </div>
  );
}
