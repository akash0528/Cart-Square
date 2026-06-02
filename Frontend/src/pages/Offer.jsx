import { useState } from "react";
import BlackShirt from "../src/assets/1/18.avif";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const sales = [
  {
    tag: "End of Season Sale",
    off: "50% OFF",
    desc: "On all clothing & accessories",
    exp: "Ends in 2 days",
    bg: "bg-[#ff3f6c]",
    text: "text-white",
  },
  {
    tag: "Buy 1 Get 1",
    off: "BOGO",
    desc: "On selected footwear",
    exp: "Limited stock",
    bg: "bg-[#282c3f]",
    text: "text-white",
  },
  {
    tag: "New Arrivals",
    off: "30% OFF",
    desc: "On all new collection items",
    exp: "Valid till 10 May",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border border-green-200",
  },
  {
    tag: "First Order",
    off: "₹200 OFF",
    desc: "On orders above ₹999",
    exp: "New users only",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border border-orange-200",
  },
];

const coupons = [
  {
    code: "SAVE200",
    desc: "Flat ₹200 off on orders above ₹999",
    exp: "Valid till 15 May 2026 · Max discount ₹200",
    color: "bg-[#ff3f6c]",
  },
  {
    code: "STYLE30",
    desc: "Extra 30% off on clothing",
    exp: "Valid till 20 May 2026 · Min order ₹1,499",
    color: "bg-indigo-500",
  },
  {
    code: "FREESHIP",
    desc: "Free delivery on any order",
    exp: "Valid till 31 May 2026 · No min order",
    color: "bg-[#03a685]",
  },
  {
    code: "FIRST200",
    desc: "₹200 off on your first order",
    exp: "New users only · Valid once",
    color: "bg-amber-400",
  },
];

const Offer = () => {
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <PropagateLoader loading={true} />
      </div>
    );

  return (
    <div className=" bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold text-[#282c3f]">Offers & Coupons</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Best deals just for you — limited time only
        </p>
      </div>

      <div>
        {/* Hero Banner - Image as full background */}
        <div className="relative overflow-hidden h-[450px] ">
          {/* Background Image */}
          <img
            src={BlackShirt}
            alt="Sale"
            className="absolute inset-0 w-full h-full object-fill object-top"
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 z-10">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff3f6c] animate-pulse" />
              <span className="text-xs font-bold text-[#ff3f6c] uppercase tracking-widest">
                Limited Time Only
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              UPTO
              <br />
              <span className="text-[#ff3f6c]">50% OFF</span>
            </h2>

            <p className="text-sm text-gray-400 mt-3">
              End of Season Sale · All clothing & accessories
            </p>

            <button
              className="mt-5 w-fit bg-[#ff3f6c] hover:bg-[#e0315e] active:scale-95 text-white text-sm font-bold 
    uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Shop Now →
            </button>
          </div>
        </div>

        {/* Sale Banners */}
        <p className="text-3xl md:text-6xl font-bold text-black uppercase tracking-widest mb-3 font-sans py-2">
          🔥 Active Sales
        </p>
        <div className=" px-8 grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6 ">
          {sales.map((s, i) => (
            <div
              key={i}
              className={`${s.bg} ${s.text} ${s.border || ""} rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">
                {s.tag}
              </p>
              <p className="text-4xl font-extrabold leading-tight my-1">
                {s.off}
              </p>
              <p className="text-sm opacity-85">{s.desc}</p>
              <p className="text-xs opacity-60 mt-2">{s.exp}</p>
              <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full opacity-10 bg-current" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offer;
