
import { useNavigate } from "react-router-dom";
import { MapPin } from '../../constants/icons';

export default function OrderDetails({ order }) {

    const navigate = useNavigate();
  return (
    <div className="track-details">

      {/* Restaurant */}
      <div className="track-detail-card" onClick={() =>
          navigate(`/restaurants/${order.restaurant._id}`)
        }>
        
        <h3>Restaurant</h3>

        <div className="track-restaurant">
          <div>
            <p className="track-rest-name">
              {order.restaurant?.name}
            </p>

            <p className="track-rest-address">
              {order.restaurant?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="track-detail-card">
        <h3>Items Ordered</h3>

        <div className="track-items">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="track-item-row"
            >
              <span className="track-item-name">
                {item.menuItem?.name}
              </span>

              <span className="track-item-qty">
                x{item.quantity}
              </span>

              <span className="track-item-price">
                ₹
                {item.price *
                  item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="track-total-row">
          <span>Total</span>

          <span>
            ₹{order.totalAmt?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="track-detail-card">
        <h3>Delivery Address</h3>

        <p className="track-address">
          <MapPin size={15} /> {order.deliveryAdd}
        </p>
      </div>
    </div>
  );
}