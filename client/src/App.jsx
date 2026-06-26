import Navbar from "./components/Navbar";
import Home from "./page/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/form/Login";
import Signup from "./page/form/Signup";
import { Toaster } from "react-hot-toast";
import AddRestaurant from "./page/form/AddRestaurant";
import RestaurantPage from './page/RestaurantPage';
import AddMenu from "./page/form/AddMenu";
import Footer from "./components/Footer";
import EditRestaurant from "./page/form/EditRestaurant";
import Cart from "./page/Cart";
import TrackOrder from "./page/TrackOrder";
import RestaurantDashboard from "./page/RestaurantDashboard";
import AgentDashboard from "./page/AgentDashboard";
import CustomerDashboard from "./page/CustomerDashboard";
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
      />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route path='/addRestaurant' element={<AddRestaurant/>}/>
        <Route path="/restaurants/:id" element={<RestaurantPage />} />
        <Route path="/restaurants/:rId/addMenu" element={<AddMenu/>}/>
        <Route path="/restaurants/edit/:id" element={<EditRestaurant/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders/:orderid/track" element={<TrackOrder/>} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard/>}/>
        <Route path="/agent/dashboard" element={<AgentDashboard/>}/>
        <Route path='/customer/dashboard' element={<CustomerDashboard/>}/>
      </Routes>
      <Footer/>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
