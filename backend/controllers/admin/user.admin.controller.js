import prisma from "../../db/connectDB.js";

const getAllUsersForAdmin = async (req, res) => {
  try {
    // Step 1: Check if the user is an admin by accessing req.user.role
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: "Access denied. Admins only." });
    }

    // Step 2: Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        role: true,
        is_verified: true,
        last_login: true,
      }, // You can adjust the fields as per your requirement
    });

    // Step 3: Send the response with the list of users
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


export { getAllUsersForAdmin };
