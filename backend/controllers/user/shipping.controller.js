import prisma from "../../db/connectDB.js";

const createShipping = async (req, res) => {
  const {
    street,
    pincode,
    city,
    state,
    country = "India",
    landmark,
    address_type,
    country_code = "+91",
    number,
  } = req.body;

  // Input validation
  if (
    !street ||
    !pincode ||
    !city ||
    !state ||
    !country ||
    !number ||
    !address_type ||
    !number
  ) {
    return res.status(400).json({
      success: false,
      error: "Error: Please provide all required fields.",
    });
  }

  // Validate phone number format (basic example for validation)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(number)) {
    return res
      .status(400)
      .json({ error: "Phone number must be a 10-digit number." });
  }

  try {
    const defaultShippingDetails = await prisma.shippingDetails.findMany({
      where: {
        user_id: req.user.id,
        is_default: true,
      },
    });

    if (defaultShippingDetails.length === 0) {
      const newShippingDetail = await prisma.shippingDetails.create({
        data: {
          street,
          pincode,
          city,
          state,
          country,
          landmark,
          address_type,
          country_code,
          number,
          user_id: req.user.id,
          is_default: true,
        },
      });
      return res.status(201).json({ success: true, data: newShippingDetail });
    } else {
      const newShippingDetail = await prisma.shippingDetails.create({
        data: {
          street,
          pincode,
          city,
          state,
          country,
          landmark,
          address_type,
          country_code,
          number,
          user_id: req.user.id,
          is_default: false,
        },
      });
      return res.status(201).json({ success: true, data: newShippingDetail });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create shipping details" });
  }
};

const getDefaultShippingAddress = async (req, res) => {
  // Get all shipping details of the user
  try {
    const shippingDetails = await prisma.shippingDetails.findFirst({
      where: {
        user_id: req.user.id,
        is_default: true,
      },
    });

    if (shippingDetails === null) {
      return res.status(404).json({
        success: false,
        error: "No default shipping address found",
      });
    }

    return res.status(200).json({ success: true, data: shippingDetails });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch shipping details" });
  }
};

const updateDefaultShippingAddress = async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(401).json({
      success: false,
      error: "You are not authorized to update this data.",
    });
  }

  const {
    street,
    pincode,
    city,
    state,
    country = "India",
    landmark,
    address_type,
    country_code = "+91",
    number,
  } = req.body;

  // Input validation
  if (
    !street ||
    !pincode ||
    !city ||
    !state ||
    !country ||
    !number ||
    !address_type ||
    !number
  ) {
    return res.status(400).json({
      success: false,
      error: "Error: Please provide all required fields.",
    });
  }

  // Validate phone number format (basic example for validation)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(number)) {
    return res
      .status(400)
      .json({ error: "Phone number must be a 10-digit number." });
  }

  try {
    // Step 1: Get the current default shipping detail's ID for the user
    const existingShippingDetail = await prisma.shippingDetails.findFirst({
      where: {
        user_id: req.user.id,
        is_default: true,
      },
      select: {
        id: true, // Select only the ID of the default shipping detail
      },
    });

    if (!existingShippingDetail) {
      return res
        .status(404)
        .json({ error: "No default shipping detail found for the user." });
    }

    // Step 2: Update the default shipping detail
    const updatedShippingDetail = await prisma.shippingDetails.update({
      where: {
        id: existingShippingDetail.id, // Use the ID from the previous query
      },
      data: {
        street,
        pincode,
        city,
        state,
        country,
        landmark,
        address_type,
        country_code,
        number,
      },
    });

    res.status(200).json({ success: true, data: updatedShippingDetail });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update shipping details" });
  }
};

const deleteDefaultShippingAddress = async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(401).json({
      success: false,
      error: "You are not authorized to delete this data.",
    });
  }

  try {
    // Step 1: Get the current default shipping detail's ID for the user
    const existingShippingDetail = await prisma.shippingDetails.findFirst({
      where: {
        user_id: req.user.id,
        is_default: true,
      },
      select: {
        id: true, // Select only the ID of the default shipping detail
      },
    });

    if (!existingShippingDetail) {
      return res
        .status(404)
        .json({ error: "No default shipping detail found for the user." });
    }

    // Step 2: Delete the default shipping detail
    await prisma.shippingDetails.delete({
      where: {
        id: existingShippingDetail.id, // Use the ID from the previous query
      },
    });

    return res.status(200).json({ success: true, message: "Shipping detail deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete shipping details" });
  }
}

export {
  createShipping,
  getDefaultShippingAddress,
  updateDefaultShippingAddress,
  deleteDefaultShippingAddress
};
