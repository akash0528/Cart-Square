import React from "react";
import { useState } from "react";

const Sidebar = ({ onFilterChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState(10000);

  const handleCheck = (e) => {
    const value = e.target.value;

    let updated;

    if (e.target.checked) {
      updated = [...category, value];
    } else {
      updated = category.filter((c) => c !== value);
    }

    setCategory(updated);

    onFilterChange({ category: updated, price });
  };

  return (
    <div className="flex h-screen bg-stone-100 rounded-xl overflow-hidden border border-stone-200 ">
      <div
        className={`flex flex-col bg-white border-r border-stone-200 shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? "w-14" : "w-64"
        }`}
      >
        {/* Toggle */}
        <div className="flex items-center justify-between px-3.5 py-4 border-b border-stone-200 min-h-14">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="white">
                <path d="M2 2h5v5H2zm7 0h5v5H9zM2 9h5v5H2zm7 0h5v5H9z" />
              </svg>
            </div>
            <span
              className={`text-sm font-medium text-stone-800 whitespace-nowrap transition-opacity duration-200 ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Cart Sqaure
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 border border-stone-300 rounded-md flex items-center justify-center shrink-0 text-stone-400 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
        </div>

        {/* Sorting Button */}
        <div className="flex-1 overflow-y-auto py-2">
          <p
            className={`text-[10px] font-medium text-stone-400 uppercase tracking-widest px-4 pt-2.5 pb-1
                 whitespace-nowrap transition-opacity duration-200 ${
                   collapsed ? "opacity-0" : "opacity-100"
                 }`}
          >
            Categories
          </p>
          <div
            className={` gap-2 my-2 px-4  font-medium text-stone-400  uppercase tracking-widest pt-2.5 pb-1
                 whitespace-nowrap transition-opacity duration-200  ${
                   collapsed ? "opacity-0" : "opacity-100"
                 }`}
          >
            <div className="space-y-2">
              {[
                "Shirt",
                "Suits",
                "Jeans",
                "Shoes",
                "Hoodie",
                "Shorts",
                "T-Shirt",
              ].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 
                  rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-black cursor-pointer"
                      onChange={handleCheck}
                      value={cat}
                      checked={category.includes(cat)}
                    />
                    <span className="text-xs text-gray-700">{cat}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="py-4 pt-6">
              <p className="text-[10px] font-semibold text-gray-700 mb-2">
                Price Range
              </p>

              <div className="bg-gray-50 p-3 rounded-lg">
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={price}
                  className="w-full accent-black cursor-pointer"
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    setPrice(newPrice);
                    onFilterChange({ category, price: newPrice });
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹100</span>
                  <span>{price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
