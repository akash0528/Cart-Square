import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import AddCartContext from "../Context/AddCartContext";
import Api from "../Api/axios";
import { toast } from "react-toastify";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("upi");
  const [selApp, setSelApp] = useState("GPay");
  const [loading, setLoading] = useState(false);
  const { cart, totalPrice, mrpTotal, discount } = useContext(AddCartContext);
  const { addressId } = state;
  const fmtCard = (val) =>
    val
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);

  const createOrder = async (paymentMethod, paymentStatus) => {
    try {
      const orderData = {
        addressId,
        totalAmount: totalPrice,
        paymentMethod,
        paymentStatus,
      };

      await Api.post("/auth/order", orderData, {
        withCredentials: true,
      });
      console.log(orderData);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const handlePay = async () => {
    try {
      setLoading(true);

      //COD
      if (method === "cod") {
        await createOrder("COD", "pending");
        navigate("/order-success");
        return;
      }

      const { data } = await Api.post(
        "/auth/create-order",
        { amount: totalPrice },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: data.amount,
        currency: data.currency,

        name: "CartSquare",

        description: "Order Payment",

        order_id: data.id,

        handler: async function (response) {
          console.log(response);

          await createOrder("ONLINE", "paid");
          navigate("/order-success");
        },

        prefill: {
          name: state?.address?.fullName,
          contact: state?.address?.phoneNo,
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.log(err);
      toast.error("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <div className="h-[3px] bg-[#1a1a1a]">
        <div className="h-full w-2/3 bg-gradient-to-r from-violet-400 to-violet-700 rounded-full" />
      </div>

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white border-0 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-white font-bold text-base">Checkout</span>
        </div>
        <div className="flex bg-[#1a1a1a] rounded-full p-1 gap-1">
          {["Address", "Payment", "Done"].map((s, i) => (
            <span
              key={s}
              className={`px-3 py-1 rounded-full text-xs font-bold ${i === 1 ? "bg-violet-700 text-white" : i === 0 ? "text-violet-400" : "text-[#555]"}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest px-1">
            Choose Payment Method
          </p>

          {/* Methods */}
          {[
            {
              id: "upi",
              icon: "📱",
              label: "UPI",
              sub: "GPay, PhonePe, Paytm & more",
            },
            {
              id: "card",
              icon: "💳",
              label: "Credit / Debit Card",
              sub: "Visa, Mastercard, RuPay",
            },
            {
              id: "cod",
              icon: "💵",
              label: "Cash on Delivery",
              sub: "Pay when order arrives",
            },
          ].map((m) => (
            <div key={m.id}>
              <button
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border cursor-pointer text-left transition-all bg-[#111] ${method === m.id ? "border-violet-600" : "border-[#222]"}`}
              >
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-xl shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#ccc]">{m.label}</p>
                  <p className="text-xs text-[#555] mt-0.5">{m.sub}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${method === m.id ? "border-violet-500" : "border-[#333]"}`}
                >
                  {method === m.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  )}
                </div>
              </button>

              {/* UPI Panel */}
              {method === "upi" && m.id === "upi" && (
                <div className="bg-[#111] border border-[#1e1e1e] border-t-0 rounded-b-2xl px-4 pb-4 -mt-2 pt-4">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((a) => (
                      <button
                        key={a}
                        onClick={() => setSelApp(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${selApp === a ? "border-violet-600 bg-[#1a0d2e] text-violet-300" : "border-[#2a2a2a] bg-[#0d0d0d] text-[#555]"}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <input
                    placeholder="Enter UPI ID (example@upi)"
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-600 transition-all"
                  />
                </div>
              )}

              {/* COD Panel */}
              {method === "cod" && m.id === "cod" && (
                <div className="bg-[#111] border border-[#1e1e1e] border-t-0 rounded-b-2xl px-4 pb-4 -mt-2 pt-4">
                  <div className="flex gap-3 bg-[#0d2e1a] border border-emerald-900/40 rounded-xl p-3">
                    <span className="text-lg">✅</span>
                    <p className="text-sm text-emerald-400 font-medium">
                      Pay in cash when your order arrives. No extra charges
                      applied.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 h-fit sticky top-4">
          <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-4">
            Your Order
          </p>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0"
            >
              <div className="w-10 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-lg shrink-0">
                <img
                  src={item.productId?.images[0]}
                  alt={item.productId?.productName}
                  className="rounded-lg object-fill "
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#ccc]">
                  {" "}
                  {item.productId?.productName}
                </p>
                <p className="text-[11px] text-[#555]">
                  {item.productId?.brand}
                </p>
              </div>
              <span className="text-xs font-bold text-violet-400">
                ₹{Math.round(item.productId.productPrice)}
              </span>
            </div>
          ))}
          <div className="border-t border-[#1e1e1e] mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-xs text-[#555]">
              <span>MRP Total</span>
              <span>₹{Math.round(mrpTotal).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#555]">Discount</span>
              <span className="text-emerald-400">
                − ₹{Math.round(discount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#555]">Delivery</span>
              <span className="text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1e1e1e]">
              <span>Total</span>
              <span>₹{Math.round(totalPrice).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full mt-4 bg-violet-700 hover:bg-violet-800 active:scale-95 disabled:opacity-70 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer border-0"
          >
            {loading
              ? "Processing..."
              : method === "cod"
                ? "Place Order"
                : `Pay ₹${totalPrice?.toLocaleString("en-IN")} →`}
          </button>
          <p className="text-[11px] text-[#333] text-center mt-2">
            🔒 End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
