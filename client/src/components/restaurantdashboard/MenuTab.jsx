import { useNavigate } from "react-router-dom";

export default function MenuTab({
  menu,
  restaurant,
  toggleAvailability,
  deleteMenuItem,
}) {
  const navigate = useNavigate();

  if (menu.length === 0) {
    return (
      <div className="dash-empty">
        <p>No menu items yet.</p>
        <button
          className="dash-btn-primary"
          onClick={() =>
            navigate(`/restaurants/${restaurant?._id}/menu/addItem`)
          }
        >
          + Add first item
        </button>
      </div>
    );
  }

  return (
    <div className="dash-menu-list">
      {menu.map((item) => (
        <div
          key={item._id}
          className={`dash-menu-card ${
            !item.isAvailable ? "unavailable" : ""
          }`}
        >
          <img
            src={item.image?.url || "/placeholder.jpg"}
            alt={item.name}
            className="dash-menu-img"
          />

          <div className="dash-menu-info">
            <div className="dash-menu-top">
              <h3>{item.name}</h3>
              <span className="dash-menu-price">₹{item.price}</span>
            </div>

            {item.description && (
              <p className="dash-menu-desc">{item.description}</p>
            )}

            {item.category && (
              <span className="dash-menu-cat">{item.category}</span>
            )}
          </div>

          <div className="dash-menu-actions">
            <button
              className={`dash-toggle-btn ${
                item.isAvailable ? "available" : "unavailable"
              }`}
              onClick={() => toggleAvailability(item)}
            >
              {item.isAvailable ? "Available" : "Unavailable"}
            </button>

            <button
              className="dash-delete-btn"
              onClick={() => deleteMenuItem(item._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}