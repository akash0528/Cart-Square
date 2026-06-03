import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState, useContext } from "react";
import Api from "../Api/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AuthContext from "../Context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await Api.post("/auth/signin", formData, {
        withCredentials: true,
      });
      const user = res.data.user;
      login(user);
      toast.success("Welcome back!");
      if (user?.role === "admin" || user?.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signin Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://cart-square.onrender.com/api/auth/google";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ClipLoader loading={true} color="#000" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT — Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format"
          alt="fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 left-10">
          <h1
            className="text-white text-4xl font-light tracking-[0.3em]"
            style={{ fontFamily: "serif" }}
          >
            CARTSQUARE
          </h1>
        </div>
        <div className="absolute bottom-10 left-10">
          <p className="text-white text-2xl font-light leading-snug">
            Welcome back. <br /> We missed you.
          </p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 text-center">
          <h1
            className="text-3xl font-light tracking-[0.3em] text-black"
            style={{ fontFamily: "serif" }}
          >
            CARTSQUARE
          </h1>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-light tracking-widest text-black uppercase mb-1">
            Sign In
          </h2>
          <p className="text-xs text-gray-400 tracking-wider mb-8">
            Welcome back — sign in to your account
          </p>

          <form onSubmit={submitHandle} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <MdOutlineMail
                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                onChange={handleChange}
                required
                className="w-full pl-6 pb-2 pt-1 border-b border-gray-300 focus:border-black outline-none text-xs tracking-widest text-black placeholder-gray-400 bg-transparent transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <TbLockPassword
                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="password"
                name="password"
                placeholder="PASSWORD"
                onChange={handleChange}
                required
                className="w-full pl-6 pb-2 pt-1 border-b border-gray-300 focus:border-black outline-none text-xs tracking-widest text-black placeholder-gray-400 bg-transparent transition-colors"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[10px] tracking-widest text-gray-400 hover:text-black transition underline underline-offset-2"
              >
                FORGOT PASSWORD?
              </Link>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-black text-white text-xs tracking-[0.3em] uppercase py-4 hover:bg-gray-800 active:scale-95 transition-all cursor-pointer border-0"
              >
                Sign In
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3.5 text-xs tracking-widest text-gray-600 hover:border-black hover:text-black transition-all cursor-pointer bg-transparent"
            >
              <FcGoogle size={18} />
              CONTINUE WITH GOOGLE
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-gray-400 tracking-wider pt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-black font-semibold underline underline-offset-2 hover:opacity-70 transition"
              >
                CREATE ACCOUNT
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
