import { useContext, useEffect, useState } from "react";
import BlackShirt from "../src/assets/BlackShirt.webp";
import { Heart } from "lucide-react";
import wishListContext from "../Context/WishlistContext";
import AddCartContext from "../Context/AddCartContext";
import { useNavigate } from "react-router-dom";
import Api from "../Api/axios";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";

const Category = () => {
  const [ProductData, setProductData] = useState([]);
  const [sort, setSort] = useState("All");
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { cart, addCart } = useContext(AddCartContext);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/BestSeller", { withCredentials: true });
      setProductData(res.data.BestProduct || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered =
    sort === "All"
      ? ProductData
      : ProductData.filter(
          (p) => p.category?.toLowerCase() === sort.toLowerCase(),
        );

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans">
      {/* Announcement */}
      <div className="bg-gray-900 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee text-gray-300 text-xs font-medium tracking-widest">
          <span className="mx-8">⭐ 20% OFF ON FIRST ORDER</span>
          <span className="mx-8">🚚 FREE SHIPPING ABOVE ₹999</span>
          <span className="mx-8">🔒 SECURE PAYMENTS</span>
          <span className="mx-8">↩️ EASY RETURNS</span>
          <span className="mx-8">⭐ PREMIUM QUALITY PRODUCTS</span>

          {/* Duplicate */}
          <span className="mx-8">⭐ 20% OFF ON FIRST ORDER</span>
          <span className="mx-8">🚚 FREE SHIPPING ABOVE ₹999</span>
          <span className="mx-8">🔒 SECURE PAYMENTS</span>
          <span className="mx-8">↩️ EASY RETURNS</span>
          <span className="mx-8">⭐ PREMIUM QUALITY PRODUCTS</span>
        </div>
      </div>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center px-2 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Category</h1>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-stone-300 rounded-md px-2.5 py-1.5 bg-white text-stone-500 outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-black text-2xl">No products found in "{sort}"</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((p, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/ProductDetails/${p._id}`)}
                >
                  <div
                    className="relative bg-stone-100 overflow-hidden"
                    style={{ aspectRatio: "4/4" }}
                  >
                    <img
                      src={p.images?.[0]}
                      alt={p.productName}
                      className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.tag && (
                      <span
                        className={`absolute top-2.5 left-2.5 text-[9px] font-bold tracking-widest px-2 py-1 rounded-full ${tagStyle[p.tag]}`}
                      >
                        {p.tag}
                      </span>
                    )}

                    <button
                      className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/40 rounded-full flex 
                      items-center justify-center cursor-pointer border-0 hover:bg-black transition "
                    >
                      <Heart
                        size={16}
                        onClick={(e) => {
                          if (!user) {
                            e.stopPropagation();
                            toast.warn("Please SignIn");
                            return;
                          }
                          e.stopPropagation();
                          toggleWishlist(p);
                        }}
                        className={`cursor-pointer ${
                          wishlist.find(
                            (w) => w._id?.toString() === p._id?.toString(),
                          )
                            ? "text-red-500 fill-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {p.productName}
                    </p>

                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{Math.round(p.productPrice)}
                      </span>
                      {p.discountPercent > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{p.actualPrice?.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-red-500">
                            {p.discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {cart.some(
                      (c) => c.productId?._id?.toString() === p._id?.toString(),
                    ) ? (
                      <button
                        onClick={() => navigate("/Cart")}
                        className="w-full mt-2 py-2 text-sm bg-green-400 text-white font-bold rounded-lg cursor-pointer"
                      >
                        View Cart →
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/ProductDetails/${p._id}`)}
                        className="w-full mt-2 py-2 text-sm bg-black text-white font-bold rounded-lg cursor-pointer hover:bg-gray-800 transition"
                      >
                        Add to Cart 🛒
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Category;
