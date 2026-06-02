import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import AddCartContext from "../Context/AddCartContext";
import Api from "../Api/axios";
import { toast } from "react-toastify";

const Address = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("Home");
  const [save, setSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const { cart, totalPrice, mrpTotal, discount } = useContext(AddCartContext);
  const [form, setForm] = useState({
    fullName: "",
    phoneNo: "",
    landMark: "",
    city: "",
    houseNo: "",
    pinCode: "",
    state: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitAddress = async () => {
    if (
      !form.fullName ||
      !form.phoneNo ||
      !form.houseNo ||
      !form.city ||
      !form.pinCode ||
      !form.state ||
      !form.landMark
    ) {
      alert("All Fields are Required");
      return;
    }

    try {
      setLoading(true);
      const res = await Api.post(
        "/auth/address",
        {
          ...form,
          addressType: type,
        },
        { withCredentials: true },
      );

      console.log("Address Saved", res.data);

      navigate("/payment", {
        state: {
          address: res.data.address,
          addressId: res.data.address._id,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Address save failed");
      console.log("Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "houseNo", label: "House no, Street, Area", full: true },
    { name: "landMark", label: "Landmark" },
    { name: "city", label: "City" },
    { name: "pinCode", label: "Pincode", maxLength: 6 },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Progress Bar */}
      <div className="h-[3px] bg-[#1a1a1a]">
        <div className="h-full w-1/3 bg-gradient-to-r from-violet-400 to-violet-700 rounded-full transition-all" />
      </div>

      {/* Header */}
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
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${i === 0 ? "bg-violet-700 text-white" : "text-[#555]"}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
        <div className="flex flex-col gap-3">
          {/* Type */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-3 flex items-center gap-2">
              Deliver to <span className="flex-1 h-px bg-[#1e1e1e]" />
            </p>
            <div className="flex gap-2">
              {["🏠 Home", "💼 Work", "📌 Other"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t.split(" ")[1])}
                  className={`flex-1 py-2 rounded-xl text-xs font-700 border cursor-pointer transition-all ${type === t.split(" ")[1] ? "border-violet-600 bg-[#1a0d2e] text-violet-300" : "border-[#2a2a2a] bg-[#0d0d0d] text-[#555]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Personal */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-4 flex items-center gap-2">
              Personal info <span className="flex-1 h-px bg-[#1e1e1e]" />
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["fullName", "Full Name"],
                ["phoneNo", "Phone"],
              ].map(([name, label]) => (
                <div key={name} className="relative">
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 pt-5 pb-2 text-sm text-white outline-none focus:border-violet-600 transition-all"
                  />
                  <label className="absolute left-4 top-3.5 text-xs text-[#555] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-violet-400 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-400 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-4 flex items-center gap-2">
              Address details <span className="flex-1 h-px bg-[#1e1e1e]" />
            </p>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ name, label, full, maxLength }) => (
                <div
                  key={name}
                  className={`relative ${full ? "col-span-2" : ""}`}
                >
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength={maxLength}
                    className="peer w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 pt-5 pb-2 text-sm text-white outline-none focus:border-violet-600 transition-all"
                  />
                  <label className="absolute left-4 top-3.5 text-xs text-[#555] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-violet-400 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-400 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider">
                    {label}
                  </label>
                </div>
              ))}
              <div className="col-span-2">
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#777] outline-none focus:border-violet-600 transition-all"
                >
                  <option value="">Select State</option>
                  {[
                    "Delhi",
                    "Uttar Pradesh",
                    "Maharashtra",
                    "Karnataka",
                    "Tamil Nadu",
                    "Rajasthan",
                    "Gujarat",
                    "Haryana",
                    "Punjab",
                    "West Bengal",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#ccc]">
                Save for next time
              </p>
              <p className="text-xs text-[#444] mt-0.5">
                Faster checkout on future orders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={save}
                onChange={() => setSave(!save)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#2a2a2a] rounded-full peer peer-checked:bg-violet-700 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#555] after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white" />
            </label>
          </div>
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
                  className="rounded-lg object-fill"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#ccc]">
                  {item.productId?.productName}
                </p>
                <p className="text-[11px] text-[#555]">
                  {item.productId?.brand}
                </p>
              </div>
              <span className="text-xs font-bold text-violet-400">
                ₹ {Math.round(item.productId.productPrice)}
              </span>
            </div>
          ))}
          <div className="border-t border-[#1e1e1e] mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-xs text-[#555]">
              <span>MRP Total</span>
              <span className="text-emerald-400">
                ₹{Math.round(mrpTotal).toLocaleString("en-IN")}
              </span>
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
            onClick={handleSubmitAddress}
            className="w-full mt-4 bg-violet-700 hover:bg-violet-800 active:scale-95 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer border-0"
          >
            Continue to Payment →
          </button>
          <p className="text-[11px] text-[#333] text-center mt-2">
            🔒 End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Address;
