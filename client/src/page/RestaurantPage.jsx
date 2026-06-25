import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import '../css/restaurant/RestaurantPage.css';
import RestaurantHero from '../components/restaurant/RestaurantHero';
import MenuList from '../components/restaurant/MenuList';

export default function RestaurantPage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const user = JSON.parse(localStorage.getItem('user'));

  const [restaurant, setrestaurant] = useState(null);
  const [menu, setmenu] = useState([]);
  const [cart, setcart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });
  const [activecategory, setactivecategory] = useState('All');
  const [loading, setloading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => { fetchRestaurant(); }, []);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`/restaurants/${id}`);
      setrestaurant(res.data.rest);
      setmenu(res.data.menu);
    } catch(err) {
      toast.error(err.response?.data?.msg || "failed to load restaurant");
    } finally {
      setloading(false);
    }
  };

  // ── Rating ──────────────────────────────────────────
  async function handlerate(rating) {
    if (!user) { toast.error("Please login first"); return; }
    if (user.role !== 'customer') { toast.error('Only customers can rate'); return; }

    setRatingLoading(true);
    try {
      const res = await axios.post(`/restaurants/${id}/rate`, {rating});
      setrestaurant((prev) => ({...prev, rating: res.data.rating}));
      setUserRating(rating);
      toast.success("Rating submitted!");
    } catch(err) {
      toast.error(err.response?.data?.msg || "Failed to rate");
    } finally {
      setRatingLoading(false);
    }
  }

  // ── Cart ────────────────────────────────────────────
  const addtocart = (item) => {
    if (!restaurant.isOpen) {
      toast.error("Restaurant is currently closed");
      return;
    }

    const existingRestId = cart[0]?.restaurantId;
    if (existingRestId && existingRestId !== id) {
      toast.error("Clear your cart before ordering from another restaurant");
      return;
    }

    setcart((prev) => {
      const found = prev.find((c) => c._id === item._id);
      if (found) {
        // ✅ fixed: c._id not c.id
        return prev.map((c) =>
          c._id === item._id ? {...c, quantity: c.quantity + 1} : c
        );
      }
      // ✅ fixed: restaurantId not restaurantid
      return [...prev, {...item, quantity: 1, restaurantId: id}];
    });

    toast.success(`${item.name} added to cart`);
  };

  const removefromcart = (itemid) => {
    setcart((prev) => {
      const found = prev.find((c) => c._id === itemid);
      if (!found) return prev;  // ✅ always return prev
      if (found.quantity === 1) return prev.filter((c) => c._id !== itemid);
      return prev.map((c) =>
        c._id === itemid ? {...c, quantity: c.quantity - 1} : c
      );
    });
  };

  const getquantity = (itemid) => {
    return cart.find((c) => c._id === itemid)?.quantity || 0;
  };

  const totalitems = cart.reduce((sum, c) => sum + c.quantity, 0);

  const categories = ['All', ...new Set(menu.map((m) => m.category).filter(Boolean))];
  const filtered = activecategory === 'All'
    ? menu
    : menu.filter((m) => m.category === activecategory);
  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const isOwner = user && restaurant && user.id === restaurant.owner?._id;

  if (loading) return <p className="rest-page-status">Loading...</p>;
  if (!restaurant) return <p className="rest-page-status">Restaurant not found.</p>;

  const handledelete = async () => {
    try {
      await axios.delete(`/restaurants/${id}`);
      toast.success("Restaurant deleted successfully");
      navigate("/");
    } catch(err) {
      toast.error(err.response?.data?.msg || "Deletion unsuccessful");
    }
  };

  const handleDeleteMenu = async (iId)=>{
    try{
      await axios.delete(`/restaurants/${id}/menu/${iId}`);
      toast.success("menu item deleted successfully");
       setmenu(prev =>
            prev.filter(
                item => item._id !== iId
            )
        );

         setcart(prev =>
            prev.filter(
                item => item._id !== iId
            )
        );
       navigate(`/restaurants/${id}`);
    }catch(err){
      toast.error(err.response?.data?.msg || "cannot be deleted");
    }
  }
  return (
    <div className="rest-page">
      <div className='restpageleft'>
         <RestaurantHero restaurant={restaurant} menu={menu}/>
      <div className="rest-body">

        {isOwner && (
          <div className="owner-action">
            <button
              className="owner-add-btn"
              onClick={() => navigate(`/restaurants/${id}/addMenu`)}
            >
              + Add Menu
            </button>
            <button className="owner-add-btn" onClick={handledelete}>
              Delete
            </button>
            <button className='owner-add-btn' onClick={()=>navigate(`/restaurants/edit/${id}`)}>
              Edit
            </button>
          </div>
        )}

        {/* ── Rating ──────────────────────────────── */}
        {user?.role === 'customer' && (
          <div className="rating-section">
            <p className="rating-label">Rate this restaurant</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  // ✅ fixed: handlerate not handleRate
                  className={`star-btn ${star <= (hoveredRating || userRating) ? 'filled' : ''}`}
                  onClick={() => handlerate(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={ratingLoading}
                >
                  ★
                </button>
              ))}
            </div>
            {userRating > 0 && <p className="rating-thanks">You rated {userRating} / 5 ⭐</p>}
          </div>
        )}
      </div>
      </div>
       <div className="restpageright">
          {categories.length > 1 && (
          <div className="rest-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-tab ${activecategory === cat ? 'active' : ''}`}
                onClick={() => setactivecategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

             {
             menu.length === 0 ? (
             <p className="rest-page-status">
                No menu items yet.
            </p>
                ) : (
                <MenuList
                grouped={grouped}
                isOwner={isOwner}
                   addtocart={addtocart}
                removefromcart={removefromcart}
                 getquantity={getquantity}
            handleDeleteMenu={handleDeleteMenu}
           />
            )
           }
       </div>
      

      {/* ── Floating cart ────────────────────────── */}
      {totalitems > 0 && user?.role==='customer' && (
        <div className="cart-float" onClick={() => navigate(`/cart`)}>
          <span className="cart-float-count">{totalitems} items</span>
          <span>View Cart →</span>
          <span className="cart-float-total">
            ₹{cart.reduce((sum, c) => sum + c.price * c.quantity, 0)}
          </span>
        </div>
      )}

    </div>
  );
}
