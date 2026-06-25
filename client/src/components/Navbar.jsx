import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";


const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Restaurants", to: "/#restaurants" },
  { label: "About", to: "/about" }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

const role = user?.role;

  const handlelogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); 
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🍳 Foodie<span className="logoAccent">.</span>
      </Link>

     <ul className={`navLinks ${menuOpen ? "open" : ""}`}>
  <li>
    <Link to="/" className="navLink">
      Home
    </Link>
  </li>

  <li>
    <a href="#restaurants" className="navLink">
      Restaurants
    </a>
  </li>

  <li>
    <a href="#about" className="navLink">
      About
    </a>
  </li>
</ul>

      <div className="actions">
         {token ? (
          <button className="btnOrange" onClick={handlelogout}>log out</button>
         ):(<>
        <Link to="/login" className="btnGhost">Login</Link>
        <Link to="/signup" className="btnOrange">Sign Up</Link>
        </>)
        
         }
         {token && role === "restaurant" && (<>
    <Link to="/addRestaurant" className="btnOrange">
        Add Restaurant
    </Link>

    <Link to="/restaurant/dashboard" className="btnOrange">
        Dashboard
    </Link>
   </>
)}

    {token && role=== 'customer' && (
      <Link to="/customer/dashboard" className="btnOrange">Dashboard</Link>
    )}

    {token && role=== 'agent' && (
      <Link to="/agent/dashboard" className="btnOrange">Dashboard</Link>
    )}
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
