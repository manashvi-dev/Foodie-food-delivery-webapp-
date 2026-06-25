import { useNavigate } from "react-router-dom";


export default function DeliveredActions({
  restaurantId,
}) {
  const navigate = useNavigate();

  return (
    <div className="track-delivered">
      <h2>🎉 Enjoy your meal!</h2>

      <div className="track-delivered-btns">

        <button
          onClick={() =>
            navigate(
              `/restaurants/${restaurantId}`
            )
          }
        >
          Rate Restaurant
        </button>

        <button
          onClick={() =>
            navigate("/orders")
          }
        >
          View All Orders
        </button>

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Order Again
        </button>

      </div>
    </div>
  );
}