import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../Api/axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index])
      inputs.current[index - 1].focus();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning(" Enter Your Email");
    try {
      setLoading(true);
      await Api.post("/auth/forgot-password", { email });
      toast.success("OTP sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 4) return toast.warning("4 digit OTP daalo");
    try {
      setLoading(true);
      await Api.post("/auth/verify-reset-otp", { email, otp: otpCode });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return toast.error("Passwords didn't Match");
    if (newPassword.length < 6) return toast.warning("Minimum 6 characters");
    try {
      setLoading(true);
      await Api.post("/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      toast.success("Password reset Successfull!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #ddd",
    padding: "12px 0",
    fontSize: "13px",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    color: "#111",
    outline: "none",
    background: "transparent",
    letterSpacing: "1px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex items-center justify-center bg-white px-4"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div
            className="text-center mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 300,
              letterSpacing: "12px",
              color: "#111",
              textTransform: "uppercase",
            }}
          >
            CartSquare
          </div>

          {/* Step Title */}
          <div className="text-center mb-1">
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#111",
                fontWeight: 500,
              }}
            >
              {step === 1
                ? "Password Recovery"
                : step === 2
                  ? "Verification"
                  : "New Password"}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#aaa",
                fontWeight: 300,
                marginTop: "6px",
              }}
            >
              {step === 1 && "Enter your email address"}
              {step === 2 && `Code sent to ${email}`}
              {step === 3 && "Create a new secure password"}
            </p>
          </div>

          {/* Progress Lines */}
          <div className="flex justify-center gap-1.5 my-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  height: "1px",
                  width: step >= s ? "36px" : "24px",
                  background: step >= s ? "#111" : "#ddd",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={labelStyle}>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#ccc" : "#111",
                  color: "#fff",
                  border: "none",
                  padding: "14px",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "1rem",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>

              <p
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  textAlign: "center",
                  marginTop: "1.5rem",
                  letterSpacing: "1px",
                }}
              >
                Remember password?{" "}
                <Link
                  to="/signin"
                  style={{ color: "#111", textDecoration: "underline" }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center gap-3 my-8">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => (inputs.current[index] = el)}
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{
                      width: "52px",
                      height: "52px",
                      border: "none",
                      borderBottom: "1px solid #ddd",
                      textAlign: "center",
                      fontSize: "20px",
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      color: "#111",
                      background: "transparent",
                      outline: "none",
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#ccc" : "#111",
                  color: "#fff",
                  border: "none",
                  padding: "14px",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <p
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  textAlign: "center",
                  marginTop: "1.5rem",
                  letterSpacing: "1px",
                }}
              >
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  style={{
                    color: "#111",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "11px",
                  }}
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={labelStyle}>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <span style={labelStyle}>Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#ccc" : "#111",
                  color: "#fff",
                  border: "none",
                  padding: "14px",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "0.5rem",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
