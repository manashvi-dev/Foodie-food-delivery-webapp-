import {useNavigate} from "react-router-dom";
import "../../css/restaurant/RestaurantHero.css";
import { Star,Clock3,UtensilsCrossed} from "../../constants/icons";



export default function RestaurantHero({restaurant,menu}) {

  const navigate = useNavigate(); 


  if (!restaurant) {
  return (
    <div className="no-restaurant">
      <h2>You have not created a restaurant yet</h2>

      <button className="no-restaurant-button"
        onClick={() => navigate("/addRestaurant")}
      >
        Create Restaurant
      </button>
    </div>
  );
}
  return (
    <div className="rest-hero">
      <img
        src={
         restaurant.image?.url
          ? restaurant.image.url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/"
          )
         : "/placeholder.jpg"
        }
       alt={restaurant.name}
       className="rest-hero-img"
       width="1200"
       height="380"
       loading="eager"
       fetchPriority="high"
      />

      <div className="rest-hero-overlay">
        <div className="rest-hero-info">
          <div className="rest-hero-top">
            <h1>{restaurant.name}</h1>

            <span
              className={`rest-status ${
                restaurant.isOpen
                  ? "open"
                  : "closed"
              }`}
            >
              {restaurant.isOpen
                ? "● Open"
                : "● Closed"}
            </span>
          </div>

          <p className="rest-address">
            <b>Address :</b> {restaurant.address}
          </p>

          <div className="rest-meta">
           <span>
            <Star size={16} className="meta-icon star" />
            {restaurant.rating > 0
             ? `${restaurant.rating} / 5`
             : "No ratings yet"}
           </span>

           <span>
             <Clock3 size={16} className="meta-icon" />
             30-40 min delivery
           </span>

            <span>
              <UtensilsCrossed size={16} className="meta-icon" />
              {menu.length} items
            </span>
           </div>
        </div>
      </div>
    </div>
  );
}
