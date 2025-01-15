import prisma from "../../db/connectDB.js";

const getAllShipping = async (req, res) => {
  try {
    const allShipping = await prisma.shippingDetails.findMany();
    if (allShipping.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No shipping details found.",
      });
    }
    return res.status(200).json({ success: true, data: allShipping });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getShippingByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const shippingDetails = await prisma.shippingDetails.findMany({
      where: {
        user_id: userId,
      },
    });
    if (shippingDetails.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No shipping details found.",
      });
    }
    return res.status(200).json({ success: true, data: shippingDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getAllShipping, getShippingByUserId };
