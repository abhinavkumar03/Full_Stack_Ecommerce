import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import women_banner from "./Components/Assets/banner_women.png";
import men_banner from "./Components/Assets/banner_mens.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import LoginSignup from "./Pages/LoginSignup";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Profile from "./Pages/Profile/Profile";
import Checkout from './Pages/Checkout/Checkout';

// Admin components
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProducts from "./Pages/Admin/Products";
import AdminUsers from "./Pages/Admin/Users";
export const backend_url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
export const currency = '₹';

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Checkout />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/products" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminProducts />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
