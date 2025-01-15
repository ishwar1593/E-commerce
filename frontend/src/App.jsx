import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OTPVerification from "./pages/OTPVerification";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
    </Routes>
  );
}
export default App;
