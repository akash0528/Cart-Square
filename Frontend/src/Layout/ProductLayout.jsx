import { Outlet } from "react-router-dom";
import Sidebar from "../src/Sidebar";
import { useState } from "react";

const ProductLayout = () => {
  const [filters, setFilters] = useState({ category: [], price: 100000 });
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex w-full bg-gray-100 relative">
      {/* ✅ Desktop sidebar — sticky + screen height */}
      <div className="hidden md:flex shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Sidebar onFilterChange={setFilters} />
      </div>

      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onFilterChange={setFilters} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <Outlet context={{ filters, setShowSidebar }} />
      </div>
    </div>
  );
};

export default ProductLayout;
