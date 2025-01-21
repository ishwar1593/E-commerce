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
      where: {
        isdeleted: false,
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        role: true,
        is_verified: true,
        last_login: true,
        isdeleted: true,
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

const updateUserRole = async (req, res) => {
  const { userId, role } = req.body; // Get the new role from the request body

  // Validate the role
  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role value. Should be USER or ADMIN.",
    });
  }

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId, isdeleted: false },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is trying to update their own role
    if (userId === req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot update your own role" });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the user role" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Get the userId from the route parameter
    const { userId } = req.params;

    // Check if the user is trying to update their own role
    if (userId === req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete yourself." });
    }

    // Verify if the userId exists in the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isdeleted: false,
      },
    });

    // If user not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.email === "ishwar.t@medkart.in") {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete this user." });
    }

    // Proceed to delete the user from the database
    await prisma.user.update({
      where: {
        id: userId, // Only target the user's id for the update
      },
      data: {
        isdeleted: true, // Mark as deleted
      },
    });

    // Send a success response
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export { getAllUsersForAdmin, updateUserRole, deleteUser };
