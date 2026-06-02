import { useContext, useEffect, useState } from "react";
import wishListContext from "../Context/WishlistContext";
import { Heart } from "lucide-react";
import AddCartContext from "../Context/AddCartContext";
import { useNavigate, useOutletContext } from "react-router-dom";
import Api from "../Api/axios";
import { toast } from "react-toastify";
import AuthContext from "../Context/AuthContext";
import SearchContext from "../Context/SearchContext";
import { Menu } from "lucide-react";
import { PropagateLoader } from "react-spinners";

const Products = () => {
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { cart } = useContext(AddCartContext);
  const outletContext = useOutletContext() || {};
  const { filters, setShowSidebar } = outletContext;
  const [sort, setSort] = useState("Newest");
  const [productData, setProductData] = useState([]);
  const { user } = useContext(AuthContext);
  const { query } = useContext(SearchContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await Api.get("/products");
        setProductData(res.data.Products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  const filterProduct = (productData || []).filter((item) => {
    const matchSearch =
      !query ||
      item.productName?.toLowerCase().includes(query.toLowerCase()) ||
      item.brand?.toLowerCase().includes(query.toLowerCase());

    const matchCategory =
      !filters?.category?.length ||
      filters.category.some(
        (c) => c.toLowerCase() === item.productType?.toLowerCase(),
      );

    const matchPrice = item.productPrice <= (filters?.price ?? 10000);
    return matchSearch && matchCategory && matchPrice;
  });

  if (sort === "Price: Low to High")
    filterProduct.sort((a, b) => a.productPrice - b.productPrice);
  if (sort === "Price: High to Low")
    filterProduct.sort((a, b) => b.productPrice - a.productPrice);

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9f9f7]">
      <div className="md:hidden flex items-center gap-2 ">
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm cursor-pointer"
        >
          <Menu />
        </button>
      </div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-2 md:py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-serif">
              All Collection
            </h1>
          </div>

          <select
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-600 outline-none cursor-pointer shadow-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {filterProduct.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-4xl">🔍</p>
            <p className="text-gray-500 font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filterProduct.map((item, index) => {
              const inWishlist = wishlist.some(
                (w) => w._id?.toString() === item._id?.toString(),
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {/* Image */}
                  <img
                    src={item.images?.[0]}
                    alt={item.productName}
                    onClick={() => navigate(`/ProductDetails/${item._id}`)}
                    className="w-full h-48 sm:h-64 object-fill cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                      {item.brand}
                    </p>

                    <div className="flex items-start justify-between gap-1 mt-0.5">
                      <p
                        className="font-bold text-gray-900 truncate text-xs sm:text-sm cursor-pointer hover:text-gray-600 transition-colors line-clamp-2"
                        onClick={() => navigate(`/ProductDetails/${item._id}`)}
                      >
                        {item.productName}
                      </p>

                      <Heart
                        size={18}
                        onClick={() => {
                          if (!user) {
                            toast.warning("Please Signin! 😊");
                            return;
                          }
                          toggleWishlist(item);
                        }}
                        className={`cursor-pointer shrink-0 mt-0.5 transition-colors ${
                          inWishlist
                            ? "text-red-500 fill-red-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <span className="text-base sm:text-lg font-black text-gray-900">
                        ₹{Math.round(item.productPrice)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-gray-400 line-through">
                          ₹{item.actualPrice}
                        </span>

                        <span className="text-[10px] font-bold text-red-500">
                          -{item.discountPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    {cart.some(
                      (c) =>
                        c.productId?._id?.toString() === item._id?.toString(),
                    ) ? (
                      <button
                        onClick={() => navigate("/Cart")}
                        className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer border-0"
                      >
                        Buy Now
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!user) {
                            toast.warning("Please Signin! 😊");
                            return;
                          }
                          navigate(`/ProductDetails/${item._id}`);
                        }}
                        className="w-full mt-3 py-2 bg-black hover:bg-gray-800 text-white text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer border-0"
                      >
                        Add to Cart 🛒
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
