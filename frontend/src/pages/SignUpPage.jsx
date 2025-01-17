import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import { SearchProvider } from "../context/SearchContext";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cnfPassword: "",
  });

  const [loading, setLoading] = useState(false); // Loading state to handle button state
  const [error, setError] = useState(null); // Error state for handling API errors

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.cnfPassword) {
      toast.error("Passwords doesn't match!");
      return;
    }

    // Client-side validations
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert(
        "Password must be at least 6 characters long, including 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
      return;
    }
    setLoading(true);
    try {
      // Make API call with axios
      const response = await axios.post(`${apiUrl}/user/signup`, formData);

      // Handle success response
      console.log("Sign up successful", response);
      // Navigate to verification page
      toast.success("Check your email for the OTP.");
      navigate("/verify-otp");
    } catch (error) {
      // Handle error
      toast.error(`Error during sign-up : ${error}`);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false); // Set loading to false after API call finishes
    }
  };

  return (
    <>
      <SearchProvider>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      placeholder="John"
                      value={formData.fname}
                      onChange={(e) =>
                        setFormData({ ...formData, fname: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      placeholder="Doe"
                      value={formData.lname}
                      onChange={(e) =>
                        setFormData({ ...formData, lname: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnfPassword">Confirm Password</Label>
                  <Input
                    id="cnfPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.cnfPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cnfPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/signin" className="text-blue-500 hover:text-blue-700">
                  Sign in
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </SearchProvider>
    </>
  );
};

export default SignUpPage;
