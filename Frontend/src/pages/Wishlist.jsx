import { useContext, useState } from "react";
import wishListContext from "../Context/WishlistContext";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddCartContext from "../Context/AddCartContext";
import AuthContext from "../Context/AuthContext";
import { PropagateLoader } from "react-spinners";

const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { cart } = useContext(AddCartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-18 gap-5">
            <h1 className="text-4xl text-black font-medium">My WishList</h1>
            <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center">
              <Heart size={40} className="text-red-300" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">
                Nothing saved yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Items you love will appear here
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="px-8 py-3 bg-black text-white rounded-2xl font-semibold text-sm hover:bg-gray-800 transition cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            {" "}
            <h1 className="text-4xl text-black font-medium py-6 flex items-center gap-2">
              My Wishlist
              <Heart className="fill-red-500" size={30} />
              <span className="text-2xl">: {wishlist.length}</span>
            </h1>
            {/* // ✅ Mobile: 1 col, Tablet+: 3 col, Desktop: 4 col */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map((item) => {
                const inCart = cart.some(
                  (c) => c.productId?._id?.toString() === item._id?.toString(),
                );

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.images?.[0]}
                        alt={item.productName}
                        onClick={() => navigate(`/ProductDetails/${item._id}`)}
                        className="w-full h-64 sm:h-56 object-fill cursor-pointer group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-1 mt-0.5">
                        <p
                          className="font-bold text-gray-900 text-xs sm:text-sm cursor-pointer hover:text-gray-600 transition-colors line-clamp-2"
                          onClick={() =>
                            navigate(`/ProductDetails/${item._id}`)
                          }
                        >
                          {item.brand}
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
                            wishlist.find(
                              (w) =>
                                w._id?.toString() === item?._id?.toString(),
                            )
                              ? "text-red-500 fill-red-500"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                      <p
                        className="font-bold text-gray-900 mt-0.5 text-sm truncate cursor-pointer hover:text-gray-600"
                        onClick={() => navigate(`/ProductDetails/${item._id}`)}
                      >
                        {item.productName}
                      </p>

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
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
