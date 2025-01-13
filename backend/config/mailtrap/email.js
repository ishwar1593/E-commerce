import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./email.templates.js";
import { mailTrapClient, sender } from "./mailtrap.config.js";

const sendOTP = async (email, otp) => {
  const recipients = [
    {
      email,
    },
  ];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{OTP}", otp),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error to send verification email : ${error}`);
    throw new Error(`Failed to send verification email : ${error}`);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error to send password reset email : ${error}`);
    throw new Error(`Failed to send password reset email : ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [
    {
      email,
    },
  ];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("Password Reset Success Email sent successfully", response);
  } catch (error) {
    console.error(`Error to send password reset success email : ${error}`);
    throw new Error(`Failed to send password reset success email : ${error}`);
  }
};

export { sendOTP, sendResetPasswordEmail, sendResetSuccessEmail };
