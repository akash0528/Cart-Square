import { useState } from "react";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import {
  Package,
  ChartNoAxesCombined,
  Users,
  ShoppingCart,
  Settings,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { toast } from "react-toastify";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icons: <IoStatsChartSharp />,
    },
    { name: "Users", path: "/admin/Users", icons: <Users /> },
    {
      name: "Product Management",
      path: "/admin/ProductManagement",
      icons: <Package />,
    },
    { name: "Orders", path: "/admin/orders", icons: <ShoppingCart /> },
    { name: "Statics", path: "/admin/statics", icons: <ChartNoAxesCombined /> },
    { name: "Setting", path: "/admin/setting", icons: <Settings /> },
  ];

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandle = async (e) => {
    e.preventDefault();
    try {
      await logout();
      toast.success("logout Successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Logout Failed ");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static top-0 left-0 z-50
        w-64 bg-gray-900 text-white h-screen flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Close button — only for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 flex flex-col h-full">
          <h1 className="text-3xl mb-2 text-center font-black italic tracking-tighter uppercase">
            Cart-Square
          </h1>
          <h3 className="text-xl text-center py-2 font-black italic tracking-tighter uppercase mb-4">
            Admin Panel
          </h3>

          {/* Links */}
          <div className="flex-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-4 rounded-lg mb-2 hover:bg-indigo-500 transition-colors ${
                    isActive ? "bg-gray-500" : ""
                  }`
                }
              >
                {link.icons}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <button
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer"
            onClick={logoutHandle}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
