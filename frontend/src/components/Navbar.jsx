import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSearch } from "../context/SearchContext";

const apiUrl = "http://localhost:8000/api/v1";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
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
          // Fetch user profile
          const profileResponse = await axios.get(`${apiUrl}/user`, {
            withCredentials: true,
          });
          console.log("Profile response:", profileResponse.data.data);

          setUserProfile(profileResponse.data.data);
          // fetch cart length
          const fetchCartData = async () => {
            try {
              const response = await axios.get(`${apiUrl}/cart`, {
                withCredentials: true,
              });
              const { data } = response.data;

              setCartCount(data.items.length);
            } catch (error) {
              console.error("Failed to fetch cart data:", error);
              const localCart =
                JSON.parse(localStorage.getItem("cartItems")) || [];
              setCartItems(localCart);
            } finally {
              // setLoading(false);
            }
          };

          fetchCartData();
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const { productId, setProductId } = useSearch();
  const { searchQuery, setSearchQuery } = useSearch();
  const [searchResults, setSearchResults] = useState([]);

  // Search handler
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]); // Clear results for empty input
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/product/search?q=${query}`, {
        withCredentials: true,
      });
      console.log(query);

      console.log("Search results:", response.data.data);

      setSearchResults(response.data.data); // Update state with search results
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleProductClick = (product) => {
    console.log("productttt", product);
    setSearchQuery(product.name); // Set search query to the product name
    setProductId(product.id); // Set the product ID
    setSearchResults([]); // Clear search suggestions
  };

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
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">ShopName</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a> */}
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Products
              </a>
              <a
                href="/my-orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Orders
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {/* Render search suggestions */}
                {searchResults.length > 0 && (
                  <div className="absolute bg-white shadow-md">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => {
                          handleProductClick(result);
                        }}
                        className=" flex gap-2 w-48 items-center p-2 hover:bg-gray-100 cursor-pointer overflow-auto"
                      >
                        <img
                          src={result.images[0]}
                          className="aspect-3/4 h-4"
                          alt=""
                        />
                        <p>{result.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              {/* <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button> */}

              {isAuthenticated ? (
                // Logged in user menu
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
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
                Products
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
      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {userProfile && (
            <Card>
              <CardContent className="space-y-4 mt-4">
                <div className="flex flex-col justify-center items-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="flex justify-center font-medium text-2xl pt-4">
                      {userProfile.fname} {userProfile.lname}
                    </h3>
                    <p className="flex justify-center text-base text-gray-500">
                      Member since{" "}
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    {/* <Mail className="h-4 w-4" /> */}
                    <span className="font-bold text-lg">Email : </span>
                    <span className=" text-lg">{userProfile.email}</span>
                  </div>
                  {userProfile.role && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-bold text-lg">Role : </span>
                      <span className=" text-lg">{userProfile.role}</span>
                    </div>
                  )}
                  {userProfile.last_login && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-bold text-lg">Last Login : </span>
                      <span className=" text-lg">
                        {new Date(userProfile.last_login).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
