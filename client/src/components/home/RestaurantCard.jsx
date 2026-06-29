import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "../../constants/icons";
import "../../css/home/RestaurantCard.css";


export default function RestaurantCard({ restaurant }) {
  const { _id, name, address, image, rating, isOpen } = restaurant;
  const navigate = useNavigate();
  const prefetchRestaurantPage = () => {
  import('../../page/RestaurantPage');
};

  return (
    <div
      className="card"
      onMouseEnter={prefetchRestaurantPage}
      onClick={() => navigate(`/restaurants/${_id}`)}
    >
      {/* Image */}
      <div className="card-img-wrap">
        <img
          src={
            image?.url
              ? image.url.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_500/"
                )
              : "/placeholder.jpg"
          }
          alt={name}
          loading="lazy"
          width="400"
         height="220"
        />
      </div>

      {/* Body */}
      <div className="card-body">

        <div>
          <div className="card-title-row">
            <h3 className="card-name">{name}</h3>

            <span
              className={`card-status ${
                isOpen ? "open" : "closed"
              }`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>

          <div className="card-meta">

            <div className="card-meta-row">
              <MapPin size={15} />
              <span className="cardAddress">
                {address}
              </span>
            </div>

            <div className="card-meta-row">
              <Star size={15} fill="currentColor" />
              <span>
                {rating > 0
                  ? `${rating} / 5.0`
                  : "No ratings yet"}
              </span>
            </div>

          </div>
        </div>

        <button
          className={`card-btn ${
            !isOpen ? "card-btn--disabled" : ""
          }`}
          disabled={!isOpen}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/restaurants/${_id}`);
          }}
        >
          Explore Menu
        </button>

      </div>
    </div>
  );
}