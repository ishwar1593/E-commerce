import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OTPVerification from "./pages/OTPVerification";
import Products from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ShippingDetailsPage from "./pages/ShippingDetailsPage";
import MyOrders from "./pages/MyOrderPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const apiUrl = "http://localhost:8000/api/v1";
function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const AdminRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/check-auth`, {
          withCredentials: true,
        }); // withCredentials is important for sending cookies

        if (response.data.isAuthenticated) {
          setIsLogged(response.data.isAuthenticated);
        }
        if (response.data.user.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shipping-details" element={<ShippingDetailsPage />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}
export default App;
