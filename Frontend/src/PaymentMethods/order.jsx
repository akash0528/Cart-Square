import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div
        className={`bg-[#111] border border-[#222] rounded-3xl p-8 max-w-sm w-full text-center transition-all duration-500 ${show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {/* Check icon */}
        <div
          className="w-20 h-20 bg-[#1a0d2e] rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            animation: show
              ? "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both"
              : "none",
          }}
        >
          <CheckCircle size={40} className="text-violet-400" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          Order Placed! 🎉
        </h2>
        <p className="text-sm text-[#555] mb-4">
          Your order has been confirmed and will be delivered soon.
        </p>

        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-4 py-2 inline-block mb-6">
          <p className="text-xs text-[#555] font-mono">#ORD-2026-84721</p>
        </div>

        {/* Tracking */}
        <div className="flex items-center justify-between mb-6 px-2">
          {[
            ["✓", "Confirmed", "bg-violet-700"],
            ["⟳", "Packing", "bg-violet-700"],
            ["→", "Shipped", "bg-[#1a1a1a]"],
            ["✓", "Delivered", "bg-[#1a1a1a]"],
          ].map(([icon, label, bg], i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 flex-1 relative"
            >
              <div
                className={`w-7 h-7 ${bg} rounded-full flex items-center justify-center text-xs font-bold text-white z-10`}
              >
                {icon}
              </div>
              <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">
                {label}
              </p>
              {i < 3 && (
                <div className="absolute top-3.5 left-1/2 w-full h-px bg-[#1e1e1e] -z-0" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm py-3.5 rounded-xl border-0 cursor-pointer transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
