import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { get } from "react-hook-form";

const apiUrl = "http://localhost:8000/api/v1";

const OrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState("ALL");

  const statusChangeRules = {
    PENDING: ["CONFIRMED", "CANCELLED"], // From PENDING to CONFIRMED or CANCELLED
    CONFIRMED: ["COMPLETED"], // From CONFIRMED to COMPLETED
    COMPLETED: [], // No status change from COMPLETED
    CANCELLED: [], // No status change from CANCELLED
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/orders`, {
          withCredentials: true,
        });
        // Flatten the nested structure from the API response
        const ordersList = Object.values(response.data.data).flat();
        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: "bg-yellow-600",
      CONFIRMED: "bg-blue-600",
      COMPLETED: "bg-green-600",
      CANCELLED: "bg-red-600",
    };
    return statusMap[status] || "default";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update order status in the backend
      await axios.patch(
        `${apiUrl}/admin/orders/update-status`,
        { orderId, newStatus },
        { withCredentials: true }
      );

      // Update the status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order status updated into ${newStatus} successfully`);
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const handleFilterChange = (status) => {
    setFilteredStatus(status);
  };

  // Filter orders based on the selected status
  const filteredOrders =
    filteredStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filteredStatus);

  // Utility to apply active background color to the selected filter button
  const getButtonClass = (status) => {
    return filteredStatus === status
      ? "bg-black text-white" // Active button style
      : "text-black"; // Default style for inactive buttons
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        {/* <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader> */}
        <CardHeader>
          <CardTitle className="mb-5">Recent Orders</CardTitle>
          <div className="mt-4">
            <Button
              variant="outline"
              className={`mx-2 ${getButtonClass("ALL")}`}
              onClick={() => handleFilterChange("ALL")}
            >
              All
            </Button>
            <Button
              variant="outline"
              className={`mx-2 ${getButtonClass("PENDING")}`}
              onClick={() => handleFilterChange("PENDING")}
            >
              Pending
            </Button>
            <Button
              variant="outline"
              className={`mx-2 ${getButtonClass("CONFIRMED")}`}
              onClick={() => handleFilterChange("CONFIRMED")}
            >
              Confirmed
            </Button>
            <Button
              variant="outline"
              className={`mx-2 ${getButtonClass("COMPLETED")}`}
              onClick={() => handleFilterChange("COMPLETED")}
            >
              Completed
            </Button>
            <Button
              variant="outline"
              className={`mx-2 ${getButtonClass("CANCELLED")}`}
              onClick={() => handleFilterChange("CANCELLED")}
            >
              Cancelled
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{`${order.user.fname} ${order.user.lname}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {order.order_items.map((item, index) => (
                        <div key={item.id} className="text-sm">
                          {item.product.name} x{item.quantity}
                          {index < order.order_items.length - 1 && ", "}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className={getStatusColor(order.status)}>
                          {order.status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {statusChangeRules[order.status]?.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(order.id, status)}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>
                        {order.shippingDetails.city},{" "}
                        {order.shippingDetails.state}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingDetails.pincode}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPanel;
