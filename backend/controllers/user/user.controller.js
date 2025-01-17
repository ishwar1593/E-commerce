import prisma from "../../db/connectDB.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateOTP } from "../../utils/generateOTP.utils.js";
import {
  sendOTP,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../../config/mailtrap/email.js";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.utils.js";

const createUser = async (req, res) => {
  const { fname, lname, email, password, cnfPassword } = req.body; // Step 1 - Get the data from the request body

  //   Step 2 - Check if the required fields are filled
  if (!fname || !lname || !email || !cnfPassword || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill all fields" });
  }

  if (cnfPassword !== password) {
    return res.status(400).json({
      success: false,
      error: "Password and Confirm Password do not match",
    });
  }

  try {
    // Step 3 - Check if the user already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Step 4 - Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5 - Generate OTP
    const otp = generateOTP();

    // Step 6 - Create the user in the database
    const user = await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
        otp,
        otp_expiry: new Date(Date.now() + 5 * 60000), // 5 minutes
      },
    });

    // Step 7 - Generate token and set cookie
    generateTokenAndSetCookie(user.id, user.role, res);

    // Step 8 - Send the OTP to the user's email
    await sendOTP(user.email, otp);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully. OTP sent to email",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body; // Get the data from the request body

  // Step 2 - Check if the required fields are filled
  if (!otp) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter the OTP" });
  }

  try {
    // Step 3 - Find the user in the database using findFirst() instead of findUnique()
    const user = await prisma.user.findFirst({
      where: {
        otp, // Search for a user with the matching OTP
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    // Step 4 - Check if the OTP is correct
    if (otp !== user.otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    // Step 5 - Check if the OTP is expired
    if (Date.now() > user.otp_expiry) {
      return res.status(401).json({ success: false, error: "OTP expired" });
    }

    // Step 6 - Update the user in the database to mark as verified
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id, // Use the unique user id to update the user
      },
      data: {
        is_verified: true,
        otp: null,
        otp_expiry: null,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User account verified successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body; // Step 1 - Get the data from the request body

  // Step 2 - Check if the required fields are filled
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }

  // Step 3 - Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  //   Step 4 - Check if the user is verified
  if (!user.is_verified) {
    return res.status(400).json({
      success: false,
      message: "User not verified",
    });
  }

  // Step 5 - Compare the password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ success: false, message: "Invalid password" });
  }

  // Step 6 - Generate token and set cookie
  generateTokenAndSetCookie(user.id, user.role, res);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      last_login: new Date(Date.now()),
    },
  });

  return res.status(200).json({
    success: true,
    data: user,
    message: "User logged in successfully",
  });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body; // Step 1 - Get the data from the request body

  // Step 2 - Check if the required fields are filled
  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter your email" });
  }

  try {
    // Step 3 - Find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    if (!user.is_verified) {
      return res
        .status(400)
        .json({ success: false, error: "Email id is not verified." });
    }

    // Step 4 - Generate reset password token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    //   Step 5 - Update the user in the database
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        reset_token: resetPasswordToken, // Store the plain token temporarily
        reset_expiry: new Date(resetPasswordTokenExpiry), // Store the expiry date
      },
    });

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    return res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password, cnfPassword } = req.body; // Step 1 - Get the data from the request body

  // Step 2 - Check if the required fields are filled
  if (!password || !cnfPassword) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill all fields" });
  }

  if (password !== cnfPassword) {
    return res.status(400).json({
      success: false,
      error: "Password and Confirm Password do not match",
    });
  }

  try {
    // Step 3 - Find the user in the database
    const user = await prisma.user.findFirst({
      where: {
        reset_token: resetToken,
        reset_expiry: {
          gte: new Date(Date.now()),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired reset token" });
    }

    // Step 4 - Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5 - Update the user in the database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_expiry: null,
      },
    });

    // Step 6 - Send the success response
    await sendResetSuccessEmail(user.email);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.user;
  try {
    if (req.user.role !== "ADMIN" && id !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to access the data.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: id } });

    return res.status(200).json({
      success: true,
      message: "UserId data fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error at data fetching by useId ", error);
  }
};

export {
  createUser,
  verifyOTP,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserById,
};
