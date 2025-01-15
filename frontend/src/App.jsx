import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OTPVerification from "./pages/OTPVerification";
import Products from "./pages/ProductPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}
export default App;
