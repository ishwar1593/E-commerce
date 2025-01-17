import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router";
import { SearchProvider } from "../context/SearchContext.jsx";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";
const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    // Regex to validate email format
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // Regex to ensure:
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one numeric digit
    // - Minimum of 6 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 6 characters long. Also contains atleast 1 uppercase, 1 lowercase and 1 digit");
      return;
    }
    setIsLoading(true); // Set loading to true while the request is being made
    try {
      // Send login request to backend
      const response = await axios.post(`${apiUrl}/user/login`, formData, {
        withCredentials: true, // Include cookies in the request
      });

      if (response.data.success) {
        // If login is successful, you can redirect the user to a protected page
        toast.success("Login Successfully !");
        navigate("/");
      } else {
        toast.error("Login failed");
        setError(response.data.error || "Login failed"); // Handle error from the backend
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after request completion
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", resetEmail);
    setIsDialogOpen(false);
    // You would typically show a success message here
    alert(
      "If an account exists with this email, you will receive password reset instructions."
    );
    setResetEmail("");
  };

  return (
    <>
      <SearchProvider>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      {/* <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="text-sm text-blue-500 hover:text-blue-700 p-0"
                        >
                          Forgot password?
                        </Button>
                      </DialogTrigger> */}
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleForgotPassword}
                          className="space-y-4 mt-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="resetEmail">Email</Label>
                            <Input
                              id="resetEmail"
                              type="email"
                              placeholder="Enter your email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Send Reset Link
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-500 hover:text-blue-700">
                  Sign up
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </SearchProvider>
    </>
  );
};

export default SignInPage;
