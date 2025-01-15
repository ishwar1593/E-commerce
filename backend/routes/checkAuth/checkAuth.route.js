import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  // Verify the authentication token stored in the HttpOnly cookie
  const token = req.cookies.token; // Assuming the token is stored in the 'token' cookie

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Verify token here, e.g., using JWT
  await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token expired or invalid" });
    }

    // If token is valid, send user data back
    return res.status(200).json({ isAuthenticated: true, user });
  });
});

export default router;
