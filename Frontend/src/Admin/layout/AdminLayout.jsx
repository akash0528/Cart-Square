import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Admin/layout/AdminSidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 ">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* RIGHT CONTENT */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col bg-[#0f0f13] ">
        <div className="lg:hidden flex items-center px-4 py-3 bg-gray-900">
          <button onClick={() => setIsOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
          <h1 className="text-white font-bold text-lg ml-4 italic uppercase tracking-tight">
            Cart-Square
          </h1>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
