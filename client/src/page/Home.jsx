import "../App.css";
import poster from "../assets/home_img.png";
import RestaurantList from '../components/home/RestaurantList';
import about from "../assets/food-deliver-about.png";

export default function Home() {
  return (
    <>
    <div className="homeContainer">
      <div className="leftHomeContainer">
  <div>
    <p className="heroTitle">
      Delicious <span style={{color:"#ff6b2c"}}>food,</span>
    </p>

    <p className="heroTitle">
      delivered to you
    </p>
  </div>
  <div>
  <p className="heroDescription">
  Discover delicious food from the best restaurants near you.
  Fast delivery, fresh ingredients, and unforgettable flavors
  delivered right to your doorstep.
  </p>
  </div>
</div>

      <div className="rightHomeContainer">
        <div className="homeImage">
          <img src={poster} alt="poster" />
        </div>
      </div>
    </div>
    <section id='restaurants'>
      <RestaurantList/>
    </section>
    <section id='about'>
       <div className="aboutPage">

      <section className="aboutHero">
        <div className="aboutLeft">
          <span className="smallTitle">ABOUT US</span>

          <h1>
            Delicious Food,
            <br />
            <span>Delivered to You</span>
          </h1>

          <p>
            We connect hungry customers with the best local
            restaurants and deliver fresh meals right to
            your doorstep.
          </p>

          <button><a href='#restaurants' style={{textDecoration:"none",color:"white",fontWeight:"700"}}>Explore Restaurants</a></button>
        </div>

        <div className="aboutRight">
          <img src={about} alt="food"/>
        </div>
      </section>

      <section className="mission">
        <h1>Our Mission</h1>

        <p>
          To make food ordering easy, fast and enjoyable
          while helping local restaurants grow.
        </p>
      </section>

      <section className="stats">
        <div>
          <h1>10K+</h1>
          <p>Customers</p>
        </div>

        <div>
          <h1>500+</h1>
          <p>Restaurants</p>
        </div>

        <div>
          <h1>50K+</h1>
          <p>Orders</p>
        </div>

        <div>
          <h1>25+</h1>
          <p>Delivery Partners</p>
        </div>
      </section>

    </div>
    </section>
    </>
  );
}
