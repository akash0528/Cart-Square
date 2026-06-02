import {
  CircleArrowLeft,
  Edit2,
  Heart,
  LogOut,
  Package,
  User,
} from "lucide-react";
import { useContext } from "react";
import { MdDashboard, MdHelp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import Api from "../Api/axios";
import { useState } from "react";

const UserDashboard = ({ closeSidebar, isOpen }) => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  console.log("User:", user);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      // clear logout
      await logout();
      toast.success("Logout Successfully");

      // close side bar
      closeSidebar();

      // navigate to signin
      navigate("/signin");
    } catch (error) {
      toast.error("Logout Failed ");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const loadingToast = toast.loading("updating img...");
    try {
      const res = await Api.put("/auth/updated-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      updateUser(res.data.updateUser);
      toast.update(loadingToast, {
        render: "Profile Updated Successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Image update failed");
    }
  };
  return (
    <>
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-[80%] max-w-xs md:w-80 bg-black text-white 
p-4 z-40 transform transition-transform duration-300 ease-in-out
${isOpen ? "translate-x-0" : "translate-x-full"}
`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <button
            className="rounded-full w-10 h-10 cursor-pointer"
            onClick={closeSidebar}
          >
            <CircleArrowLeft size={30} />
          </button>

          <h1 className="text-2xl font-bold px-6 py-5 text-center">
            CartShape
          </h1>
        </div>
        {/* Profile */}
        <div className="flex flex-col items-center mt-4 relative">
          {/*  Avatar — Google image ya initials */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white"
            />
          ) : (
            // if not Avatar then show initials
            <div className="w-20 h-20 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.userName?.slice(0, 2).toUpperCase() || "U"}
            </div>
          )}
          {/* Edit icon */}
          <button
            className="absolute mt-14 ml-6  p-1 rounded-full hover:bg-indigo-600 cursor-pointer"
            onClick={() => setEditing(true)}
          >
            <Edit2 size={16} />
          </button>
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
          <p className="text-center font-bold mt-2 text-white">
            Welcome {user?.userName}
          </p>
        </div>
        {/* Menu */}
        <ul className="mt-6 space-y-2 px-4">
          <li className="flex items-center gap-3 p-3 hover:bg-indigo-600 rounded-lg cursor-pointer">
            <MdDashboard size={22} /> Dashboard
          </li>
          <li
            className="flex items-center gap-3 p-3 hover:bg-indigo-600 rounded-lg cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={22} /> Wishlist
          </li>

          <li
            className="flex items-center gap-3 p-3 hover:bg-indigo-600 rounded-lg cursor-pointer"
            onClick={() => navigate("/my-Orders")}
          >
            <Package size={22} /> Order
          </li>

          <li className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
            <MdHelp size={22} /> Help
          </li>
        </ul>

        <div className="mt-12 px-4 sm:px-6">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
          >
            <LogOut size={22} className="shrink-0" />

            <span className="text-base sm:text-lg font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
