import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = "http://localhost:8000/api/v1";

const ShippingDetail = () => {
  const [shippingDetails, setShippingDetails] = useState({
    street: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    landmark: "",
    address_type: "Home",
    country_code: "+91",
    number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderSuccess(false);
    setOrderError("");

    try {
      // First, create shipping address
      const createShippingResponse = await axios.post(
        `${apiUrl}/shipping/create-shipping`,
        shippingDetails,
        { withCredentials: true }
      );
console.log(createShippingResponse.data.success);

      if (createShippingResponse.data.success) {
        const shippingDetailsId = createShippingResponse.data.data.id; // Assuming the API response contains this ID

        // Now, create order
        const createOrderResponse = await axios.post(
          `${apiUrl}/order/create-order`,
          {
            shippingDetailsId,
          },
          { withCredentials: true }
        );
        console.log("createOrderResponse", createOrderResponse.data);
        

        if (createOrderResponse.data.success) {
          setOrderSuccess(true);

          // Redirect to My Orders after 5 seconds
          setTimeout(() => {
            navigate("/my-orders");
          }, 5000);
        } else {
          setOrderError("Failed to create order. Please try again.");
        }
      }
    } catch (err) {
      setError("Failed to create shipping address. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Form Fields */}
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  type="text"
                  id="street"
                  name="street"
                  value={shippingDetails.street}
                  onChange={handleChange}
                  required
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={shippingDetails.pincode}
                  onChange={handleChange}
                  required
                  placeholder="Enter pincode"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleChange}
                  required
                  placeholder="Enter country"
                />
              </div>

              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={shippingDetails.landmark}
                  onChange={handleChange}
                  required
                  placeholder="Enter landmark"
                />
              </div>

              <div>
                <Label htmlFor="address_type">Address Type</Label>
                <select
                  id="address_type"
                  name="address_type"
                  value={shippingDetails.address_type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  type="text"
                  id="number"
                  name="number"
                  value={shippingDetails.number}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500">{error}</p>}
              {orderError && <p className="text-red-500">{orderError}</p>}
              {orderSuccess && (
                <p className="text-green-500">Order Placed Successfully!</p>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save and Proceed"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingDetail;
