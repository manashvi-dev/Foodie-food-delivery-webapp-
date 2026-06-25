import { STATUS_COLORS } from '../../constants/orderStatus';
import { XCircle,RefreshCcw,MapPin } from '../../constants/icons';

export default function CustOrderCard({ order, ontrack, oncancel, onreorder }) {

    const canCancel = !['out_for_delivery', 'delivered', 'cancelled'].includes(order.status);
  return (
    <div className="cust-order-card">

      {/* ── Card header ─────────────────────────── */}
      <div className="cust-card-head">
        <div className="cust-card-head-left">
          <img
            src={order.restaurant?.image?.url || '/placeholder.jpg'}
            alt={order.restaurant?.name}
            className="cust-rest-img"
          />
          <div>
            <p className="cust-rest-name">{order.restaurant?.name}</p>
            <p className="cust-order-id">
              #{order._id.slice(-6).toUpperCase()} ·{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <span
          className="cust-status-badge"
          style={{
            background: STATUS_COLORS[order.status]?.bg,
            color: STATUS_COLORS[order.status]?.color,
          }}
        >
          {STATUS_COLORS[order.status]?.label}
        </span>
      </div>

      {/* ── Items ───────────────────────────────── */}
      <div className="cust-items">
        {order.items.map((item, i) => (
          <div key={i} className="cust-item-row">
            <span className="cust-item-dot">•</span>
            <span className="cust-item-name">
              {item.menuItem?.name || 'Item'}
            </span>
            <span className="cust-item-qty">x{item.quantity}</span>
            <span className="cust-item-price">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div className="cust-card-footer">
        <div className="cust-card-footer-left">
          <p className="cust-delivery-addr">
            <MapPin size={15}/> {order.deliveryAdd}
          </p>
          <p className="cust-total">
            Total: ₹{order.totalAmt?.toFixed(2)}
          </p>
        </div>

        {/* ── Actions ───────────────────────────── */}
        <div className="cust-actions">
          {order.status !== 'cancelled' && (
            <button
              className="cust-track-btn"
              onClick={ontrack}
            >
              <MapPin size={15}/> Track order
            </button>
          )}
          {order.status === 'delivered' && (
            <button
              className="cust-reorder-btn"
              onClick={onreorder}
            >
              <RefreshCcw size={15}/> Reorder
            </button>
          )}
          {canCancel && (
            <button
              className="cust-cancel-btn"
              onClick={() => oncancel(order._id)}
            >
              <XCircle size={15}/> Cancel
            </button>
          )}
        </div>
      </div>

    </div>
  
  )
}
