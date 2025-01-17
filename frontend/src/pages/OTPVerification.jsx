import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router";
import { SearchProvider } from "../context/SearchContext.jsx";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";
const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input on mount
    refs[0].current?.focus();

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    refs[5].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      try {
        // Send OTP for verification
        const response = await axios.post(`${apiUrl}/user/verify-otp`, {
          otp: otpString,
        });
        console.log(response);

        if (response.data.success) {
          toast.success("Email verified successfully. Please Sign in.");
          setSuccess(true);
          setError(null);
          // Redirect to next page or show success message
          navigate("/signin");
        } else {
          toast.error(response.data.error || "OTP verification failed.");
          setError(response.data.error || "OTP verification failed.");
          setSuccess(false);
          navigate("/verify-otp");
        }
      } catch (error) {
        // setError("An error occurred. Please try again.",error);
        setSuccess(false);
      }
    }
  };

  const handleResendOTP = () => {
    // Reset timer and disable resend button
    setTimer(300); // Reset to full timer (optional)
    setIsResendDisabled(true);
    // Handle resend OTP logic here
    console.log("Resending OTP");
  };

  // Formatting the timer to MM:SS
  const formattedTimer = `${Math.floor(timer / 60)
    .toString()
    .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`;

  return (
    <SearchProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <p className="text-center text-gray-500 mt-2">
              We've sent a verification code to your email
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={refs[index]}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 text-center text-2xl"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={otp.some((digit) => !digit)}
              >
                Verify Email
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-500">
                  Didn't receive the code?{" "}
                  {isResendDisabled ? (
                    <span>Resend in {formattedTimer}</span>
                  ) : (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal"
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Button>
                  )}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SearchProvider>
  );
};

export default OTPVerification;
