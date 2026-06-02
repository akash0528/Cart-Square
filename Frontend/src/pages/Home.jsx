import BlackShirt from "../src/assets/1/14.avif";
import { useContext, useEffect, useState } from "react";
import wishListContext from "../Context/WishlistContext";
import { Heart, Proportions } from "lucide-react";
import NewCollection from "./NewCollection";
import AddCartContext from "../Context/AddCartContext";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import Api from "../Api/axios";
import { PropagateLoader } from "react-spinners";

const Home = () => {
  const [CollectionData, setCollectionData] = useState([]);
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const { cart, addCart } = useContext(AddCartContext);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/top-Collection", {
        withCredentials: true,
      });

      setCollectionData(res.data.collection || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const usps = [
    { icon: "🚚", title: "Free Delivery", sub: "On orders above ₹999" },
    { icon: "↩️", title: "Easy Returns", sub: "15-day hassle-free returns" },
    { icon: "🔒", title: "Secure Payments", sub: "100% safe & encrypted" },
    { icon: "✅", title: "Genuine Products", sub: "Handpicked quality only" },
  ];

  const handleWishlist = (item) => {
    if (!user) {
      toast.warning("Please Signin! 😊");
      return;
    }

    toggleWishlist(item);
  };

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className="bg-[#F8F6F2]">
      {/* Announcement Bar */}
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
      {/* Hero Section */}
      <section>
        <div className="relative overflow-hidden shadow-md">
          <img
            src={BlackShirt}
            alt="BlackShirt"
            className="w-full h-[350px] sm:h-[350px] md:h-[700px] object-fill"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Content */}
          <div className="absolute inset-2 flex flex-col justify-center px-6 md:px-16 ">
            <h1 className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight pt-4 md:pt-0">
              Style That
              <br />
              <span className="text-pink-500">
                Speaks <span className="text-white">First</span>
              </span>
            </h1>

            <p className="text-white mt-4 text-sm sm:text-lg md:text-2xl max-w-2xl">
              Premium fashion curated for those who know what they want.
            </p>

            <button
              className="mt-6 w-fit bg-white cursor-pointer text-black px-1 py-1 md:px-12 md:py-4 md:font-extrabold font-semibold hover:bg-gray-200 transition"
              onClick={() => navigate("/products")}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* Top Collection */}
      <section className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 pb-4">
        <h1 className="text-2xl md:text-[80px] font-bold text-black text-start leading-none">
          TOP COLLECTION
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-5 border-0">
          {CollectionData.map((item, index) => (
            <div
              className="w-full cursor-pointer bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              key={index}
            >
              {/* Product Image */}
              <img
                src={item.images[0]}
                alt={item.Title}
                className="w-full h-52 sm:h-60 md:h-64 object-fill"
                onClick={() => navigate(`/ProductDetails/${item._id}`)}
              />

              {/* Content */}
              <div className="p-3">
                <div className="flex justify-between  items-start gap-2">
                  <p className="font-bold text-sm sm:text-sm line-clamp-2">
                    {item.productName}
                  </p>

                  <Heart
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(item);
                    }}
                    className={`cursor-pointer shrink-0 mt-0.5 transition-colors ${
                      wishlist.find(
                        (w) => w._id?.toString() === item._id?.toString(),
                      )
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                    size={20}
                  />
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                  <p className="text-base sm:text-lg font-bold">
                    ₹{Math.round(item.productPrice)}
                  </p>

                  {item.discountPercent > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.actualPrice?.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-red-500">
                        {item.discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Button */}
                <div className="pt-3">
                  {cart.some(
                    (c) =>
                      c.productId?._id?.toString() === item._id?.toString(),
                  ) ? (
                    <button
                      type="button"
                      className="w-full bg-green-400 text-black py-2.5 rounded-lg text-sm sm:text-base cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/Cart");
                      }}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button
                      className="w-full bg-black text-white py-2.5 rounded-lg text-sm sm:text-base hover:bg-gray-800 transition-all cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          toast.warning("Please Signin! 😊");
                          return;
                        }

                        navigate(`/ProductDetails/${item._id}`);
                      }}
                    >
                      Add Cart 🛒
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* USP Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {usps.map((u) => (
            <div
              key={u.title}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
            >
              <span className="text-3xl">{u.icon}</span>

              <div>
                <p className="text-sm font-bold text-gray-900">{u.title}</p>

                <p className="text-xs text-gray-400 mt-0.5">{u.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NewCollection />
    </div>
  );
};

export default Home;
