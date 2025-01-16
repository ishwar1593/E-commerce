import prisma from "../../db/connectDB.js";

const createOrder = async (req, res) => {
  const { shippingDetailsId } = req.body;

  try {
    // Validate inputs
    if (!shippingDetailsId) {
      return res
        .status(400)
        .json({ success: false, error: "Shipping details id is required." });
    }

    // Fetch the cart
    const cart = await prisma.cart.findUnique({
      where: { user_id: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Cart not found or does not belong to the user.",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty." });
    }

    // Check product stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stockQty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${item.product.name}. Available: ${item.product.stockQty}`,
        });
      }
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        user_id: req.user.id,
        shipping_details_id: shippingDetailsId,
        total: cart.total,
        status: "PENDING",
        order_items: {
          create: cart.items.map((item) => ({
            product_id: item.product_id,
            sales_price: item.product.sales_price,
            mrp: item.product.mrp,
            quantity: item.quantity,
            total: item.quantity * item.product.sales_price,
          })),
        },
      },
      include: { order_items: true },
    });

    if (!order) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create order." });
    }

    // Deduct stock quantities
    try {
      const stockUpdatePromises = cart.items.map((item) =>
        prisma.product.update({
          where: { id: item.product_id },
          data: { stockQty: { decrement: item.quantity } },
        })
      );
      await Promise.all(stockUpdatePromises);
    } catch (error) {
      console.error("Error updating product stock:", error);
      return res.status(500).json({
        error: "Internal server error.(Error updating product stock)",
      });
    }

    // Clear the cart items (delete cart items) after placing the order
    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    // Update cart total to 0 after clearing items
    await prisma.cart.update({
      where: { user_id: req.user.id },
      data: {
        total: 0, // Set total to 0
      },
    });

    return res
      .status(201)
      .json({ success: true, message: "Order created successfully.", order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while creating order." });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    // Fetch orders by userId
    const orders = await prisma.order.findMany({
      where: { user_id: req.user.id },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        shippingDetails: true, // If you want shipping details as well
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch a specific order by orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId, user_id: req.user.id },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        shippingDetails: true, // If you want shipping details as well
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

export { createOrder, getOrdersByUserId, getOrderById };
