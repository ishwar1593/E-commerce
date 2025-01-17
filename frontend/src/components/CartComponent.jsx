import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="flex items-center gap-4 py-4 border-b">
    <div className="w-24 h-24 flex-shrink-0">
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold">{item.product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">
        Pack Size: {item.product.package_size} tablets
      </p>
      <div className="flex items-baseline gap-2">
        <span className="font-bold">₹{item.product.sales_price}</span>
        <span className="text-sm text-gray-500 line-through">
          ₹{item.product.mrp}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        disabled={item.quantity >= item.product.stockQty}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    <div className="text-right min-w-[100px]">
      <div className="font-bold">
        ₹{(item.product.sales_price * item.quantity).toFixed(2)}
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-red-500"
      onClick={() => removeFromCart(item.id)}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const CartComponent = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProceedToCheckout = async () => {
    const cartData = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      setLoading(true); // Optional: Set loading state
      for (const item of cartItems) {
        const cartData = {
          productId: item.product.id,
          quantity: item.quantity,
        };

        const response = await axios.post(`${apiUrl}/cart/add-cart`, cartData, {
          withCredentials: true,
        });

        // Handle individual product response if needed
        console.log(
          `Product ${item.product.name} added to cart:`,
          response.data
        );
      }
      // Handle success (for example, navigate to a success page or checkout page)
      // console.log("Checkout successful", response.data);
      navigate("/shipping-details"); // Redirect to checkout page
    } catch (error) {
      console.error("Failed to proceed to checkout:", error);
      // Handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart from API or localStorage
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const response = await axios.get(`${apiUrl}/cart`, {
          withCredentials: true,
        });
        const { data } = response.data;

        console.log("Cart data:", data.items.length);

        const apiCart = data.items.map((item) => ({
          ...item,
          quantity:
            localCart.find((l) => l.id === item.id)?.quantity || item.quantity,
        }));

        setCartItems(apiCart);
        localStorage.setItem("cartItems", JSON.stringify(apiCart));
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(localCart);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = async (itemId, localId) => {
    console.log("Removing item from cart:", itemId);

    try {
      // Make API call to remove the item
      const response = await axios.patch(
        `${apiUrl}/cart/remove-item`,
        { productId: itemId },
        { withCredentials: true }
      );
      console.log(response.data);

      toast.success("Item removed from cart successfully");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Failed to remove item from cart:", error);
    }

    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.id !== localId);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Calculate totals
  const calculateSubtotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.product.sales_price * item.quantity,
      0
    );

  const calculateSavings = () =>
    cartItems.reduce(
      (sum, item) =>
        sum + (item.product.mrp - item.product.sales_price) * item.quantity,
      0
    );

  const calculateTotal = () => calculateSubtotal();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading your cart...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  console.log("Cart items:", cartItems);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Shopping Cart ({cartItems.length} items)
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="divide-y">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={() =>
                    removeFromCart(item.product_id, item.id)
                  }
                />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total Savings</span>
                  <span>₹{calculateSavings().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
