import jwt from "jsonwebtoken";
import prisma from "../db/connectDB.js";

const verifyJwt = async (req, res, next) => {
  try {
    // Get the token from the request to the Cookie or Authorization header
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", ""); // Step 1 - Get the token from the headers

    // Step 2 - Check if the token exists
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized request" });
    }

    let token_decoded;
    try {
      // Step 3 - Verify the token
      token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error:
          error?.message || "Unauthorized request, invalid or expired token",
      });
    }

    // Step 4 - Find the user by the decoded token
    const user = await prisma.user.findUnique({
      where: {
        id: token_decoded.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized request, user not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification", error);
    return res.status(401).json({
      success: false,
      error: error?.message || "Server error during token verification",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to access the data.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, message: `Error at server side : ${error}` });
  }
};

export { verifyJwt, isAdmin };
