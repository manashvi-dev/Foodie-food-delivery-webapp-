import "./Footer.css";


export default function Footer() {
  return (
   <footer className="footer">

  <div className="footerContainer">

    <div className="footerSection">
      <h1>🍳 Foodie</h1>
      <p>
        Bringing delicious food from your favourite
        restaurants to your doorstep.
      </p>
    </div>

    <div className="footerSection">
      <h2>Quick Links</h2>

      <a href="/">Home</a>
      <a href="/#restaurants">Restaurants</a>
      <a href="#about">About</a>
    </div>

    <div className="footerSection">
      <h2>Contact Us</h2>

      <p>📍 Bhopal, Madhya Pradesh</p>
      <p>📞 +91 9876543210</p>
      <p>✉ support@foodie.com</p>
    </div>

    <div className="footerSection">
      <h2>Follow Us</h2>

      <div className="socials">
        <span>📷 Instagram</span>
        <span>📘 Facebook</span>
        <span>🐦 Twitter</span>
      </div>
    </div>

  </div>

  <hr />

  <div className="copyright">
    © 2026 Foodie. All Rights Reserved.
  </div>

</footer>
  );
}
