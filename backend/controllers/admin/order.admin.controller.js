import prisma from "../../db/connectDB.js";

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        user_id: true,
        user: {
          select: {
            fname: true,
            lname: true,
            email: true,
            role: true,
          },
        },
        total: true,
        status: true,
        created_at: true,
        updated_at: true,
        order_items: {
          select: {
            id: true,
            sales_price: true,
            mrp: true,
            quantity: true,
            total: true,
            product: {
              select: {
                name: true,
                images: true,
                category: true,
                ws_code: true,
              },
            },
          },
        },
        shippingDetails: true, // Including all shipping details
      },
    });

    // Grouping orders by userId
    const groupedOrders = orders.reduce((acc, order) => {
      if (!acc[order.user_id]) {
        acc[order.user_id] = [];
      }
      acc[order.user_id].push(order);
      return acc;
    }, {});

    return res.json({ success: true, data: groupedOrders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;

  if (!orderId || !newStatus) {
    return res
      .status(400)
      .json({ success: false, error: "orderId and newStatus are required" });
  }

  try {
    // Check if the order exists
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Check if the new status is valid (can be extended based on your requirements)
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    });

    return res.json({
      success: true,
      data: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { getAllOrders, updateOrderStatus };
