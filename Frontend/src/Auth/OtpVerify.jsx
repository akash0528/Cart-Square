import { useContext, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Api from "../Api/axios";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [params] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const email = params.get("email");

  const handleChange = (value, index) => {
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

  const submitHandle = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      toast.warning("Enter 4 digit OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await Api.post(
        "/auth/verified",
        { email, otp: otpCode },
        { withCredentials: true },
      );
      login(res.data.user);
      setOtp(["", "", "", ""]);
      toast.success("Signup Successfully");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          fontFamily: "'Jost', sans-serif",
          background:
            "linear-gradient(135deg, #f5f0eb 0%, #ede8e0 50%, #e8ddd4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ✅ Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(180,160,140,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(180,160,140,0.10)",
            pointerEvents: "none",
          }}
        />

        {/* ✅ Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(120,100,80,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,100,80,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: "2px",
            border: "0.5px solid rgba(180,160,140,0.3)",
            padding: "3rem 2.5rem",
            boxShadow: "0 20px 60px rgba(100,80,60,0.08)",
          }}
        >
          {/* Logo */}
          <div
            className="text-center mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "26px",
              fontWeight: 300,
              letterSpacing: "10px",
              color: "#2c2416",
              textTransform: "uppercase",
            }}
          >
            CartSquare
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "0.5px",
                background: "rgba(120,100,80,0.2)",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#aaa",
                textTransform: "uppercase",
              }}
            >
              Verify
            </span>
            <div
              style={{
                flex: 1,
                height: "0.5px",
                background: "rgba(120,100,80,0.2)",
              }}
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#2c2416",
                fontWeight: 500,
              }}
            >
              Enter Your Code
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#aaa",
                fontWeight: 300,
                marginTop: "6px",
              }}
            >
              Sent to {email}
            </p>
          </div>

          {/* OTP inputs */}
          <form onSubmit={submitHandle}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "2.5rem",
              }}
            >
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputs.current[index] = el)}
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: "52px",
                    height: "56px",
                    border: "none",
                    borderBottom: `1px solid ${value ? "#2c2416" : "#ddd"}`,
                    textAlign: "center",
                    fontSize: "22px",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                    color: "#2c2416",
                    background: "transparent",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              ))}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#ccc" : "#2c2416",
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
              {loading ? "Verifying..." : "Verify Account"}
            </button>

            {/* Resend */}
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                textAlign: "center",
                marginTop: "1.5rem",
                letterSpacing: "1px",
              }}
            >
              Didn't receive OTP?{" "}
              <button
                type="button"
                style={{
                  color: "#2c2416",
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

            {/* Back */}
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                textAlign: "center",
                marginTop: "1rem",
                letterSpacing: "1px",
              }}
            >
              Back to{" "}
              <Link
                to="/signin"
                style={{ color: "#2c2416", textDecoration: "underline" }}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
