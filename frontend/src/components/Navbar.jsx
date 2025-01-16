import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Menu, User, LogOut, Package, Heart } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

const apiUrl = "http://localhost:8000/api/v1";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount] = useState(0);
  const navigate = useNavigate();

  // Check authentication status from backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/check-auth`, {
          withCredentials: true,
        }); // withCredentials is important for sending cookies
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Cart click handler
  const handleCartClick = () => {
    navigate("/cart"); // Navigate to cart page (change the path as needed)
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call backend to invalidate the session or delete the token
      await axios.post(`${apiUrl}/user/logout`, {}, { withCredentials: true });

      // clear local storage
      localStorage.removeItem("cartQuantities");

      // Update frontend state
      setIsAuthenticated(false);
      window.location.href = "/signin"; // Redirect to sign-in page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">ShopName</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </a>
            <a href="/my-orders" className="text-gray-600 hover:text-gray-900">
              Orders
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              // Logged in user menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login/Register buttons for non-authenticated users
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <a href="/signin">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/signup">Sign Up</a>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <a
              href="/"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Home
            </a>
            <a
              href="/products"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Products
            </a>
            <a
              href="/categories"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Categories
            </a>
            {!isAuthenticated && (
              <>
                <a
                  href="/signin"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
