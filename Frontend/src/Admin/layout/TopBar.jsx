import { useNavigate } from "react-router-dom";
import BlackShirt from "../../assets/BlackShirt.webp";
import { useState, useRef, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { toast } from "react-toastify";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const ref = useRef(null);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout;
      toast.success("logout Successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Logout Failed ");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="w-full py-4 px-4 flex justify-between items-center bg-blue-200">
      <div className="px-4  lg:pl-4">
        <p className="text-lg text-black mt-1 ">
          welcome :<span className="font-medium text-gray-700 text-2xl"> </span>
          {user?.userName}
        </p>
      </div>

      <div className="flex gap-6">
        <div ref={ref} className="relative ">
          {/* Trigger Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <img
                src={user?.avatar}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Chevron */}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <img
                    src={user?.avatar}
                    alt="profile"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.userName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>

              {/* Options */}
              <div className="p-1.5">
                <button
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 text-sm
                 text-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/setting")}
                >
                  👤 My Profile
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 text-sm
                 text-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/setting")}
                >
                  ⚙️ Settings
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  className="w-full flex items-center
                cursor-pointer gap-2.5 px-3.5 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
