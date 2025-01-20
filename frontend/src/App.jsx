// import { Routes, Route } from "react-router-dom";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";
// import OTPVerification from "./pages/OTPVerification";
// import Products from "./pages/ProductPage";
// import CartPage from "./pages/CartPage";
// import ShippingDetailsPage from "./pages/ShippingDetailsPage";
// import MyOrders from "./pages/MyOrderPage";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import { ToastContainer } from "react-toastify";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Navigate } from "react-router-dom";

// const apiUrl = "http://localhost:8000/api/v1";
// function App() {
//   const [isAdmin, setIsAdmin] = useState(false);

//   const AdminRoute = ({ children }) => {
//     if (!isAdmin) {
//       return <Navigate to="/" />;
//     }
//     return children;
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/check-auth`, {
//           withCredentials: true,
//         }); // withCredentials is important for sending cookies

//         if (response.data.isAuthenticated) {
//           setIsLogged(response.data.isAuthenticated);
//         }
//         if (response.data.user.role === "ADMIN") {
//           setIsAdmin(true);
//           console.log(isAdmin);
          
//         }
//       } catch (error) {
//         setIsAdmin(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <>
//       <ToastContainer position="top-right" />
//       <Routes>
//         <Route path="/signin" element={<SignInPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/verify-otp" element={<OTPVerification />} />
//         <Route path="/" element={<Products />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/shipping-details" element={<ShippingDetailsPage />} />
//         <Route path="/my-orders" element={<MyOrders />} />

//         {/* Admin Dashboard */}
//         <Route
//           path="/admin"
//           element={
//             // <AdminRoute>
//               <AdminDashboard />
//             // </AdminRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// }
// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OTPVerification from "./pages/OTPVerification";
import Products from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ShippingDetailsPage from "./pages/ShippingDetailsPage";
import MyOrders from "./pages/MyOrderPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

const apiUrl = "http://localhost:8000/api/v1";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Protected route wrapper for authenticated users
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  // Protected route wrapper for admin users
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  // Public route wrapper - redirects to home if already authenticated
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/check-auth`, {
          withCredentials: true,
        });

        setIsAuthenticated(response.data.isAuthenticated);
        setIsAdmin(response.data.user.role === "ADMIN");
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // You can replace this with a proper loading component
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        {/* Public Routes - accessible when not logged in */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <OTPVerification />
            </PublicRoute>
          }
        />

        {/* Public Route - accessible to all */}
        <Route path="/" element={<Products />} />

        {/* Protected Routes - require authentication */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipping-details"
          element={
            <ProtectedRoute>
              <ShippingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - require admin role */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;