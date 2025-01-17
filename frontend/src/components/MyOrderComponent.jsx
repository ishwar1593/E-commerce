import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { useNavigate } from "react-router";
// import { Spinner } from "@/components/ui/spinner"; // Assuming you have a Spinner component for loading

const apiUrl = "http://localhost:8000/api/v1";

const MyOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching the orders data from the backend
    axios
      .get(`${apiUrl}/order/user`, { withCredentials: true })
      .then((response) => {
        setOrders(response.data.data); // The orders are inside the "data" array
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6">My Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          {/* <Spinner size="lg" /> Show spinner while loading */}
        </div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-6 shadow-lg p-4 bg-white rounded-lg"
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">
                  Order ID: {order.id} {order.status}
                </h3>
                {/* <Badge variant="outline">{order.status}</Badge> */}
                {order.status === "PENDING" ? (
                  <Badge
                    color="info"
                    className="bg-yellow-600 hover:bg-yellow-700 text-base"
                  >
                    {order.status}
                  </Badge>
                ) : order.status === "CANCELLED" ? (
                  <Badge
                    color="success"
                    className="bg-red-600 hover:bg-red-700 text-base"
                  >
                    {order.status}
                  </Badge>
                ) : (
                  <Badge
                    color="danger"
                    className="bg-green-600 hover:bg-green-700 text-base"
                  >
                    {order.status}
                  </Badge>
                )}
              </div>
              <div className="mb-4 text-gray-600">
                <strong>Created at:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </div>

              <h4 className="font-semibold text-lg">Shipping Details:</h4>
              <div className="mb-2">
                {order.shippingDetails.street} , {order.shippingDetails.city},{" "}
                {order.shippingDetails.state} , {order.shippingDetails.country}{" "}
                - {order.shippingDetails.pincode}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Landmark : </span>
                {order.shippingDetails.landmark}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Phone number : </span>
                {order.shippingDetails.country_code}{" "}
                {order.shippingDetails.number}
              </div>

              <h4 className="font-semibold text-lg mb-2">Order Items:</h4>
              <Table className="min-w-full text-center text-sm font-light text-surface dark:text-white  border border-black">
                <thead className="border-b border-neutral-200 bg-[#332D2D] font-medium text-white dark:border-white/10">
                  <tr className="border-b border-neutral-200 dark:border-white/10">
                    <th className="py-3 text-base border border-gray-300">
                      Product Name
                    </th>
                    <th className="py-3 text-base border border-gray-300">
                      Quantity
                    </th>
                    <th className="py-3 text-base border border-gray-300">
                      Sales Price
                    </th>
                    <th className="py-3 text-base border border-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-sm text-gray-800 font-semibold border border-black">
                        {item.product.name}
                      </td>
                      <td className="py-3 text-sm text-gray-800 font-semibold border border-black">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-sm text-gray-800 font-semibold border border-black">
                        ₹{item.sales_price}
                      </td>
                      <td className="py-3 text-sm text-gray-800 font-semibold border border-black">
                        ₹{item.total}
                      </td>
                    </tr>
                  ))}
                  {/* Add a row for the total */}
                  <tr className="bg-gray-100 font-semibold">
                    <td
                      colSpan="3"
                      className="py-3 text-base border border-black text-right px-3"
                    >
                      Grand Total:
                    </td>
                    <td className="py-3 text-base border border-black text-gray-800">
                      ₹{order.total}
                    </td>
                  </tr>
                </tbody>
              </Table>

              {/* <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                View Order Details
              </Button> */}
            </div>
          </Card>
        ))
      ) : (
        <p className="text-center">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrderComponent;
