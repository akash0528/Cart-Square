import React, { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Api from "../Api/axios";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [orderStatus, setorderStatus] = useState("All");
  const [ordersData, setOrdersData] = useState([]);

  const avatarStyles = [
    {
      border: "border-indigo-500",
      text: "text-indigo-300",
      bg: "bg-indigo-500/10",
    },
    { border: "border-cyan-400", text: "text-cyan-300", bg: "bg-cyan-400/10" },
    { border: "border-pink-500", text: "text-pink-300", bg: "bg-pink-500/10" },
    {
      border: "border-amber-400",
      text: "text-amber-300",
      bg: "bg-amber-400/10",
    },
  ];

  const orderStatusStyle = {
    Complete: "bg-green-500/10 text-green-400 border border-green-500/25",
    processing: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25",
    shipped: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    delivered: "bg-green-500/10 text-green-400 border border-green-500/25",
    Cancelled: "bg-red-500/10 text-red-400 border border-red-500/25",
  };

  const TABS = ["All", "processing", "delivered", "cancelled"];

  const processingOrder = ordersData.filter(
    (u) => u.orderStatus === "processing",
  ).length;
  const deliveredOrder = ordersData.filter(
    (u) => u.orderStatus === "delivered",
  ).length;
  const cancelledOrder = ordersData.filter(
    (u) => u.orderStatus === "cancelled",
  ).length;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await Api.get("/admin/orders", {
          withCredentials: true,
        });
        setOrdersData(res.data.AllOrders);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await Api.put(
        `/auth/payment/${orderId}`,
        { orderStatus: newStatus },
        { withCredentials: true },
      );
      setOrdersData((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = ordersData.filter((u) => {
    const matchSearch =
      u.shippingAddress?.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.userId?.email.toLowerCase().includes(search.toLowerCase());
    const matchorderStatus =
      orderStatus === "All" || u.orderStatus === orderStatus;
    return matchSearch && matchorderStatus;
  });

  return (
    <div className="px-4 py-6 bg-[#0f0f13] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium px-2 text-white">
          Orders
        </h1>
        <p className="text-sm px-2 text-zinc-500">
          Track and Manage Customer Orders
        </p>

        {/* Stats — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 mt-2">
          {[
            {
              label: "Total Orders",
              value: ordersData.length,
              dot: "bg-indigo-500",
            },
            {
              label: "processing",
              value: processingOrder,
              dot: "bg-orange-400",
            },
            { label: "complete", value: deliveredOrder, dot: "bg-cyan-500" },
            { label: "Cancelled", value: cancelledOrder, dot: "bg-red-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#18181f] border border-[#27272f] rounded-2xl px-4 py-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-2 py-1 gap-3 flex flex-wrap">
        <div className="relative flex-1 min-w-50">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={15}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Orders..."
            className="w-full h-10 bg-[#18181f] border border-[#27272f] rounded-xl pl-9 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setorderStatus(tab)}
              className={`h-10 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                orderStatus === tab
                  ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
                  : "bg-[#18181f] border-[#27272f] text-zinc-500 hover:border-indigo-500/40 hover:text-indigo-300"
              }`}
            >
              {tab === "Complete" ? "Completed" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden sm:block bg-[#18181f] border border-[#27272f] rounded-2xl overflow-hidden my-4">
        <div className="grid grid-cols-[1fr_2.2fr_1fr_1fr_1.1fr_1fr] px-5 py-3.5 border-b border-[#27272f] bg-[#111117]">
          {["User ID", "Customer", "Date", "Items", "Price", "orderStatus"].map(
            (h, i) => (
              <span
                key={h}
                className={`text-[11px] font-semibold uppercase tracking-widest text-zinc-600 ${i === 3 ? "text-center" : ""}`}
              >
                {h}
              </span>
            ),
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 text-sm py-12">
            No Orders Found
          </p>
        ) : (
          filtered.map((order, idx) => {
            const av = avatarStyles[idx % avatarStyles.length];
            return (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_2.2fr_1fr_1fr_1.1fr_1fr] px-5 py-4 border-b border-[#1e1e27] last:border-0 items-center hover:bg-[#1e1e27] transition-colors"
              >
                <p className="text-sm text-zinc-600 font-semibold">
                  #{order._id}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0 ${av.border} ${av.text} ${av.bg}`}
                  >
                    {order.shippingAddress?.fullName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {order.userId?.email}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p className="text-xs text-zinc-500 text-center">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
                <p className="text-sm font-bold text-indigo-300">
                  ₹ {Math.round(order.totalAmount)}
                </p>
                <div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(order._id, e.target.value);
                    }}
                    className="text-[11px] font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer bg-transparent text-yellow-400 border-yellow-500/25"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cards — mobile only */}
      <div className="sm:hidden space-y-3 my-4 bg-[#0f0f13]">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 text-sm py-12">
            No Orders Found
          </p>
        ) : (
          filtered.map((order, idx) => {
            const av = avatarStyles[idx % avatarStyles.length];
            return (
              <div
                key={order.id}
                className="bg-[#18181f] border border-[#27272f] rounded-2xl px-4 py-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0 ${av.border} ${av.text} ${av.bg}`}
                    >
                      {order.shippingAddress?.fullName
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">
                        {order.fullName}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {order.userId?.email}
                      </p>
                    </div>
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(order._id, e.target.value);
                    }}
                    className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer bg-[#0f0f13] ${orderStatusStyle[order.orderStatus]}`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="complete">Complete</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 border-t border-[#27272f] pt-3">
                  <span>#{order.id}</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <span>
                    {order.items.length} item{order.items > 1 ? "s" : ""}
                  </span>
                  <span className="text-indigo-300 font-bold">
                    {Math.round(order?.totalAmount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
