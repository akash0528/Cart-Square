import { useContext, useState } from "react";
import AddCartContext from "./Context/AddCartContext";
import { Trash2, Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import wishListContext from "./Context/WishlistContext";
import { useNavigate } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";

const ProductCart = () => {
  const {
    removeCart,
    updateQuantity,
    totalPrice,
    cart,
    getDiscountedPrice,
    discount,
    mrpTotal,
  } = useContext(AddCartContext);
  const [removing, setRemoving] = useState(null);
  const [loading, setLoading] = useState(false);
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => removeCart(id), 300);
  };

  const SubmitHandle = () => {
    if (!user) {
      toast.warning("Please signin");
      navigate("/signin");
      return;
    }
    navigate("/address");
  };

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag size={20} className="text-[#030303]" />
          <h1 className="text-lg font-bold text-[#282c3f]">My Bag</h1>
          <span className="bg-[#080708] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        </div>
        <p className="text-sm text-green-600 font-semibold">
          🎉 Free Delivery on this order
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-[60vh] gap-4"
          style={{ animation: "fadeScaleIn 0.4s ease" }}
        >
          <ShoppingBag size={64} className="text-gray-200" />
          <p className="text-gray-400 text-lg font-medium">Your bag is empty</p>
          <p className="text-gray-400 text-sm">Add items to get started</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
          <div>
            {cart.map((item, idx) => (
              <div
                key={item._id}
                style={{
                  animation:
                    removing === item._id
                      ? "fadeScaleOut 0.3s ease forwards"
                      : `fadeScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.08}s both`,
                }}
                className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 mb-3"
              >
                {/* ✅ Image — responsive size */}
                <img
                  src={item.productId?.images[0]}
                  alt={item.productId?.productName}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-lg bg-gray-50 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-xs font-bold text-[#282c3f] tracking-wider uppercase truncate">
                      {item.productId?.brand || "Brand"}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {item.productId?.productName}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                    </div>

                    {(() => {
                      const finalPrice = Math.round(
                        item.productId?.productPrice || 0,
                      );
                      const originalPrice = Math.round(
                        item.productId?.actualPrice || finalPrice,
                      );
                      const discountPercent =
                        Number(item.productId?.discountPercent) || 0;
                      return (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <p className="text-base font-bold text-[#282c3f]">
                            ₹{finalPrice.toLocaleString("en-IN")}
                          </p>
                          {discountPercent > 0 && (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                ₹{originalPrice.toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs font-bold text-orange-500">
                                {discountPercent}% OFF
                              </p>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* ✅ Quantity + Actions — stack on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden w-fit">
                      <button
                        onClick={() => updateQuantity(item._id, "dec")}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 h-8 flex items-center justify-center text-sm font-bold text-[#282c3f] border-x border-gray-200">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, "inc")}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Remove + Wishlist */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="flex items-center gap-1 text-xs font-bold text-red-500 uppercase tracking-wide hover:opacity-70 transition"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                      <div className="w-px h-4 bg-gray-200" />
                      <button
                        onClick={() => toggleWishlist(item.productId)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide hover:opacity-70 transition"
                      >
                        <Heart
                          size={13}
                          className={
                            wishlist.some(
                              (w) =>
                                w._id?.toString() ===
                                item.productId?._id?.toString(),
                            )
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                        />
                        Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="bg-white rounded-xl border border-gray-100 p-5 h-fit sticky top-5"
            style={{
              animation:
                "fadeScaleIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Price Details
            </p>
            <div className="flex justify-between text-sm text-[#282c3f] mb-3">
              <span>MRP ({cart.length} items)</span>
              <span>₹{Math.round(mrpTotal).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#282c3f]">Discount</span>
              <span className="text-green-600 font-semibold">
                − ₹{Math.round(discount)}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#282c3f]">Delivery</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#282c3f] pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>₹{Math.round(totalPrice)}</span>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center text-sm font-semibold text-green-600 mt-4">
              🎉 You save ₹{Math.round(discount)} on this order
            </div>
            <button
              className="w-full mt-4 bg-black hover:bg-[#2892e9] active:scale-95 text-white font-bold text-sm uppercase tracking-widest py-3.5 rounded-lg transition-all cursor-pointer"
              onClick={SubmitHandle}
            >
              Place Order
            </button>
            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              🔒 Safe &amp; Secure Payments
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeScaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeScaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProductCart;
