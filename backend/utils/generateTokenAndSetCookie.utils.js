import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, role, res) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // cookie will only be sent in a first-party context
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
