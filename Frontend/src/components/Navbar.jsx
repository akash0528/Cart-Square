import { useContext, useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Heart, X } from "lucide-react";
import UserDashboard from "../pages/UserDashboard";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import AddCartContext from "../Context/AddCartContext";
import SearchContext from "../Context/SearchContext";
import Api from "../Api/axios";

const CartSquareLogo = () => (
  <svg width="180" height="64" viewBox="0 0 600 120" fill="none">
    <text
      x="300"
      y="78"
      textAnchor="middle"
      fontFamily="'Great Vibes', cursive"
      fontSize="80"
      fill="#2C2416"
    >
      CartSquare
    </text>
    <line
      x1="60"
      y1="96"
      x2="205"
      y2="96"
      stroke="#2C2416"
      strokeWidth="0.8"
      opacity="0.35"
    />
    <text
      x="300"
      y="101"
      textAnchor="middle"
      fontFamily="'Raleway', sans-serif"
      fontSize="11"
      fontWeight="500"
      fill="#2C2416"
      letterSpacing="4"
      opacity="0.55"
    >
      online store
    </text>
    <line
      x1="395"
      y1="96"
      x2="540"
      y2="96"
      stroke="#2C2416"
      strokeWidth="0.8"
      opacity="0.35"
    />
  </svg>
);

const navLinks = [
  { label: "Home", to: "/home" },
  { label: "Products", to: "/products" },
  { label: "Category", to: "/category" },
  { label: "Offer", to: "/offer" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { cart } = useContext(AddCartContext);
  const { query, setQuery } = useContext(SearchContext);
  const [allProducts, setAllProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Api.get("/products");
        setAllProducts(res.data.Products || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filter products
  const filteredProducts = query
    ? allProducts
        .filter(
          (p) =>
            p.productName?.toLowerCase().includes(query.toLowerCase()) ||
            p.brand?.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const RegisterUser = () => {
    if (!user) {
      navigate("/signin");
      toast.warning("Please Signin");
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Raleway:wght@500&display=swap"
        rel="stylesheet"
      />

      <nav className="bg-white border border-gray-100 shadow-sm py-3 px-2 md:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="shrink-0 w-32 sm:w-40 md:w-auto -ml-10">
            <CartSquareLogo />
          </div>

          {/* Nav links desktop */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold transition-all no-underline flex flex-col items-center
                    ${isActive ? "text-gray-900" : "text-gray-600"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`mt-1 h-0.5 rounded-full transition-all duration-300 ${isActive ? "w-10 bg-gray-900" : "w-0"}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ✅ Search with Dropdown */}
          <div ref={searchRef} className="hidden sm:block relative w-72">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-gray-400 transition-colors">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => query && setShowDropdown(true)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
              {/* Clear button */}
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setShowDropdown(false);
                  }}
                >
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* ✅ Dropdown */}
            {showDropdown && query && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No products found
                  </p>
                ) : (
                  <>
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/ProductDetails/${product._id}`);
                          setShowDropdown(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.productName}
                          className="w-10 h-12 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {product.productName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.brand}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">
                          ₹{Math.round(product.productPrice)}
                        </p>
                      </div>
                    ))}

                    {/* View all button */}
                    <div
                      onClick={() => {
                        navigate("/products");
                        setShowDropdown(false);
                      }}
                      className="px-4 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                    >
                      View all results →
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-0 cursor-pointer md:hidden">
              <Search size={20} className="text-gray-700" />
            </button>

            <button
              className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-0 cursor-pointer"
              onClick={() => navigate("/Cart")}
            >
              <ShoppingBag size={20} className="text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-0 cursor-pointer"
              onClick={() => navigate("/wishlist")}
            >
              <Heart size={20} className="text-gray-700" />
            </button>

            <div>
              <button
                className="rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-0 cursor-pointer"
                onClick={RegisterUser}
              >
                {user ? (
                  <div className="p-1">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.userName}&background=6366f1&color=fff`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-2.5">
                    <User size={20} className="text-gray-700" />
                  </div>
                )}
              </button>
              {menuOpen && (
                <UserDashboard
                  closeSidebar={() => setMenuOpen(false)}
                  isOpen={menuOpen}
                />
              )}
            </div>

            {user && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border-0 cursor-pointer"
              >
                <div className="w-5 flex flex-col gap-1">
                  <span
                    className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                  />
                  <span
                    className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
                  />
                  <span
                    className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {user && menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
            </div>
          </div>
        )}

        <div className="md:hidden flex items-center justify-center gap-0.5 -mt-3 pb-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center px-2 py-1 rounded-xl text-sm font-semibold transition-all no-underline
        ${isActive ? "text-black" : "text-gray-600"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>

                  <span
                    className={`mt-0.5 h-[2px] rounded-full transition-all duration-300 ${
                      isActive ? "w-8 bg-black" : "w-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
