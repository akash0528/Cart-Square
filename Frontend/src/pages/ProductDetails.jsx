import { useContext, useEffect, useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import wishListContext from "../Context/WishlistContext";
import AddCartContext from "../Context/AddCartContext";
import Api from "../Api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { cart, addCart } = useContext(AddCartContext);
  const { user } = useContext(AuthContext);
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await Api.get(`/product/${id}`);
        setProductData(res.data.getAllData);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Product not found");
          navigate("/products");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddCart = () => {
    if (!user) {
      toast.warning("Please Sign In first 😊");
      navigate("/signin");
      return;
    }
    if (!selectedSize) {
      Swal.fire({
        title: "Select Size",
        text: "Please select a size before adding to cart",
        icon: "warning",
        confirmButtonColor: "#000",
      });
      return;
    }
    addCart({ productId: productData._id, selectedSize });
  };

  const inCart = cart.some(
    (c) => c.productId?._id?.toString() === productData?._id?.toString(),
  );
  const inWishlist = wishlist.find(
    (w) => w._id?.toString() === productData?._id?.toString(),
  );
  const discountPercent = productData?.discountPercent || 0;
  const actualPrice = productData?.actualPrice;
  const images = productData?.images || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6]">
        <ClipLoader loading={true} color="#000" />
      </div>
    );
  }

  if (!productData) return null;

  return (
    <div className="bg-[#f8f8f6]">
      {/* ── Main Layout ── */}
      <div className=" ">
        <div className="flex flex-col md:flex-row gap-8 bg-white  shadow-sm p-4 md:p-8">
          {/* ── LEFT — Images ── */}
          <div className="w-full md:w-1/2 flex gap-3">
            {/* Thumbnail strip — hidden on mobile */}
            <div className="hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[500px]">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setCurrentImage(i)}
                  className={`w-14 h-18 rounded-lg object-cover cursor-pointer border-2 shrink-0 transition-all ${
                    currentImage === i
                      ? "border-black opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  style={{ height: "72px" }}
                />
              ))}
            </div>

            {/* Main image */}
            <div
              className="relative flex-1 rounded-xl overflow-hidden bg-gray-50"
              style={{ height: "clamp(300px, 50vw, 500px)" }}
            >
              <img
                src={images[currentImage]}
                alt={productData.productName}
                className="w-full h-full object-fill transition duration-300"
              />

              {/* Prev */}
              {currentImage > 0 && (
                <button
                  onClick={() => setCurrentImage((p) => p - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-white transition"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Next */}
              {currentImage < images.length - 1 && (
                <button
                  onClick={() => setCurrentImage((p) => p + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-white transition"
                >
                  <ChevronRight size={18} />
                </button>
              )}

              {/* Dots — mobile only */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 sm:hidden">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer border-0 ${
                        i === currentImage ? "bg-black w-4" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Discount badge */}
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT — Info ── */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Brand + Name */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                {productData.brand}
              </p>
              <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {productData.productName.toUpperCase()}
              </h1>
              <p className="text-sm text-gray-400 mt-1 capitalize">
                {productData.productType} · {productData.category}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{Math.round(productData.productPrice).toLocaleString("en-IN")}
              </span>
              {discountPercent > 0 && actualPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{actualPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-bold text-red-500">
                    Save ₹
                    {(actualPrice - productData.productPrice).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Size Select */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Select Size
                </h5>
                {selectedSize && (
                  <span className="text-xs text-gray-500">
                    Selected: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.variants?.map((v) => (
                  <button
                    key={v.size}
                    disabled={v.stock === 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`relative w-12 h-12 rounded-full px-3  border-2 font-semibold text-sm transition cursor-pointer ${
                      v.stock === 0
                        ? "border-gray-200 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                        : selectedSize === v.size
                          ? "bg-black text-white border-black"
                          : "border-gray-200 text-gray-700 hover:border-gray-900"
                    }`}
                  >
                    {v.size}
                    {v.stock > 0 && v.stock <= 5 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
                        {v.stock}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {/* Size guide */}
            </div>

            {/* Stock info */}
            {selectedSize &&
              (() => {
                const variant = productData.variants?.find(
                  (v) => v.size === selectedSize,
                );
                return (
                  variant && (
                    <p
                      className={`text-sm font-medium ${
                        variant.stock > 10
                          ? "text-green-600"
                          : variant.stock > 0
                            ? "text-orange-500"
                            : "text-red-500"
                      }`}
                    >
                      {variant.stock > 10
                        ? "✓ In Stock"
                        : variant.stock > 0
                          ? `⚠ Only ${variant.stock} left`
                          : "✗ Out of Stock"}
                    </p>
                  )
                );
              })()}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              {inCart ? (
                <button
                  onClick={() => navigate("/Cart")}
                  className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
              ) : (
                <button
                  onClick={handleAddCart}
                  className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              )}

              <button
                onClick={() => toggleWishlist(productData)}
                className={`px-4 py-3.5 rounded-xl border-2 transition cursor-pointer flex items-center gap-2 font-semibold text-sm ${
                  inWishlist
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-gray-400 text-gray-600"
                }`}
              >
                <Heart
                  size={18}
                  className={inWishlist ? "fill-red-500 text-red-500" : ""}
                />
                <span className="hidden sm:inline">
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { icon: "🚚", text: "Free Delivery" },
                { icon: "↩️", text: "Easy Returns" },
                { icon: "🔒", text: "Secure Pay" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3 text-center"
                >
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[11px] font-medium text-gray-500">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
