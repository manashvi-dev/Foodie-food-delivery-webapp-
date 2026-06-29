import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Frequently visited page
import Home from "./page/Home";

// Lazy loaded pages
const Login = lazy(() => import("./page/form/Login"));
const Signup = lazy(() => import("./page/form/Signup"));
const AddRestaurant = lazy(() => import("./page/form/AddRestaurant"));
const RestaurantPage = lazy(() => import("./page/RestaurantPage"));
const AddMenu = lazy(() => import("./page/form/AddMenu"));
const EditRestaurant = lazy(() => import("./page/form/EditRestaurant"));
const Cart = lazy(() => import("./page/Cart"));
const TrackOrder = lazy(() => import("./page/TrackOrder"));
const RestaurantDashboard = lazy(() => import("./page/RestaurantDashboard"));
const AgentDashboard = lazy(() => import("./page/AgentDashboard"));
const CustomerDashboard = lazy(() => import("./page/CustomerDashboard"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/addRestaurant" element={<AddRestaurant />} />

          <Route
            path="/restaurants/:id"
            element={<RestaurantPage />}
          />

          <Route
            path="/restaurants/:rId/addMenu"
            element={<AddMenu />}
          />

          <Route
            path="/restaurants/edit/:id"
            element={<EditRestaurant />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/orders/:orderid/track"
            element={<TrackOrder />}
          />

          <Route
            path="/restaurant/dashboard"
            element={<RestaurantDashboard />}
          />

          <Route
            path="/agent/dashboard"
            element={<AgentDashboard />}
          />

          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />
        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}

export default App;