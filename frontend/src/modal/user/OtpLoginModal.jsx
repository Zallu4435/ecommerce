import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOtpVerifyMutation,
  useVerifyResetPasswordMutation,
} from "../../redux/apiSliceFeatures/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setEmailOtpToken, setResetPassword } from "../../redux/slice/userSlice";
import { toast } from "react-toastify";

const OTPLoginModal = ({ isOpen, change }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const [otpVerify] = useOtpVerifyMutation();
  const [verifyResetPassword] = useVerifyResetPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.otpToken);

  useEffect(() => {
    if (resendCountdown > 0) {
      const resendTimer = setInterval(() => {
        setResendCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(resendTimer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(resendTimer);
    }
  }, [resendCountdown]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpVerify = async () => {
    const otpString = otp.join("");

    try {
      console.log("Verifying OTP:", {
        token: token,
        otp: otpString,
      });

      console.log(change, "change")

      if (change === "otp") {
        const response = await otpVerify({
          token: token,
          otp: otpString,
        }).unwrap();

        console.log("OTP Verify Response:", response);

        dispatch(
          setCredentials({
            user: response.user,
            token: response.accessToken,
          })
        );

        toast.success("Login successful!");
        navigate("/");
        dispatch(setEmailOtpToken(null));
      } else if (change === "forget-password") {
        const response = await verifyResetPassword({
          token: token,
          otp: otpString,
        }).unwrap();

        console.log("Reset OTP Verify Response:", response);

        toast.success("OTP verified successfully!");
        dispatch(setResetPassword(response.resetToken));
        navigate("/reset-password", { state: { token: response.resetToken } });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setErrorMessage(error?.data?.message || "Invalid OTP");
      toast.error(error?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOTP = () => {
    // Implement the resend OTP logic here
    toast.info("OTP has been resent!");
    setResendCountdown(30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-gradient-to-r from-red-400 via-purple-500 to-pink-500 p-10 rounded-2xl max-w-lg w-full shadow-2xl text-center">
        <p
          className="font-bold text-white cursor-pointer"
          onClick={() => {
            navigate(-1);
            dispatch(setEmailOtpToken(null));
          }}
        >
          Back to email
        </p>
        <h2 className="text-3xl font-extrabold text-white mb-6">
          {change === "otp" ? "Enter Login OTP" : "Enter Password Reset OTP"}
        </h2>
        <div className="flex justify-center mb-8 space-x-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-2xl text-center text-white bg-gray-800 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        <button
          onClick={handleOtpVerify}
          className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-300 shadow-lg mb-4"
        >
          Verify OTP
        </button>
        <div>
          <button
            onClick={handleResendOTP}
            disabled={resendCountdown > 0}
            className={`mt-4 ${
              resendCountdown > 0 ? "bg-gray-500" : "bg-yellow-500"
            } text-white py-2 px-4 rounded-lg transition duration-300`}
          >
            {resendCountdown > 0
              ? `Resend OTP in ${resendCountdown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginModal;
