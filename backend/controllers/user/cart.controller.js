import prisma from "../../db/connectDB.js";

// API for getting the user's cart
const getUserCart = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated (access user ID from req.user)
    const { id } = req.user;

    if (!id) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }

    // Step 2: Fetch the cart for the authenticated user
    const cart = await prisma.cart.findUnique({
      where: {
        user_id: id, // Ensure we fetch the cart for the authenticated user
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Step 3: If no cart items are found, return an appropriate message
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "No items in cart" });
    }

    // Step 4: Return the cart items
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// API to add a product to the user's cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body; // productId and quantity should come from the request body

  // Step 1: Check if productId and quantity are provided
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      error: "Product ID and valid quantity are required",
    });
  }

  try {
    const { id } = req.user; // Get user ID from the authenticated user (via middleware)

    if (!id) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Step 2: Check if the user already has a cart
    let cart = await prisma.cart.findUnique({
      where: {
        user_id: id,
      },
    });

    // If no cart exists, create a new cart
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: id,
          total: 0,
        },
      });
    }

    // Step 3: Get the product details from the database
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Step 4: Ensure there is enough stock for the quantity being added
    if (product.stockQty < quantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough stock available. Only ${product.stockQty} items left.`,
      });
    }

    // Step 5: Check if the product already exists in the cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity in the cart
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: quantity, // Increment quantity
        },
      });
    } else {
      // Add new product to the cart
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity,
        },
      });
    }

    // Step 6: Recalculate cart total
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cart_id: cart.id,
      },
      include: {
        product: true,
      },
    });

    const updatedTotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.sales_price,
      0
    );

    const cartData = await prisma.cart.update({
      where: {
        id: cart.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
                sales_price: true,
                mrp: true,
                images: true,
              },
            },
          },
        },
      },
      data: {
        total: updatedTotal,
      },
    });

    return res.status(201).json({
      success: true,
      data: cartData,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  console.log("API Called");
  const { productId } = req.body; // Product ID should come from the request body
  // Step 1: Check if productId is provided
  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "Product ID is required",
    });
  }

  try {
    const { id } = req.user; // Get user ID from the authenticated user (via middleware)

    if (!id) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Step 2: Check if the user has a cart
    let cart = await prisma.cart.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    // Step 3: Check if the product exists in the cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId,
        },
      },
    });

    if (!existingCartItem) {
      return res.status(404).json({
        success: false,
        error: "Product not found in cart",
      });
    }

    // Step 4: Remove the item from the cart
    await prisma.cartItem.delete({
      where: {
        id: existingCartItem.id,
      },
    });

    // Step 5: Update the cart total
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cart_id: cart.id,
      },
      include: {
        product: true,
      },
    });

    const updatedTotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.sales_price,
      0
    );

    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        total: updatedTotal,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from the authenticated user (via middleware)

    if (!id) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Step 1: Check if the user has a cart
    const cart = await prisma.cart.findUnique({
      where: {
        user_id: id,
      },
      include: {
        items: true, // Include items to check the products in the cart
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cart is already empty",
      });
    }

    // Step 2: Delete all items in the cart
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
      },
    });

    // Step 3: Set the cart total to 0
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        total: 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cart has been cleared successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getUserCart, addToCart, removeFromCart, clearCart };
