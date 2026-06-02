import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PackageCheck,
  Truck,
  Clock3,
  XCircle,
  MapPin,
  CreditCard,
} from "lucide-react";
import Swal from "sweetalert2";
import Api from "./Api/axios";

const statusConfig = {
  processing: {
    label: "Processing",
    color: "text-black",
    bg: "bg-yellow-200",
    icon: <Clock3 size={13} />,
  },
  shipped: {
    label: "Shipped",
    color: "text-sky-600",
    bg: "bg-sky-50",
    icon: <Truck size={13} />,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bg: "bg-green-50",
    icon: <PackageCheck size={13} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: <XCircle size={13} />,
  },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderCancel, setOrderCancel] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await Api.get("/auth/orders", {
          withCredentials: true,
        });

        setOrders(res.data.AllGetOrders || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Cancel this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep Order",

      background: "#18181b",
      color: "#fff",

      customClass: {
        popup: "rounded-3xl shadow-2xl border border-zinc-700",
        title: "text-2xl font-bold",
        htmlContainer: "text-zinc-400",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl mr-3",
        cancelButton:
          "bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-5 py-3 rounded-xl",
      },

      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      setOrderCancel(true);

      await Api.put(
        `/auth/order/cancel/${id}`,
        { orderStatus: newStatus },
        { withCredentials: true },
      );

      // instant UI update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, orderStatus: newStatus } : order,
        ),
      );

      Swal.fire({
        title: "Cancelled!",
        text: "Your order has been cancelled.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    } finally {
      setOrderCancel(false);
    }
  };

  return (
    <div className="min-h-screen  pb-10">
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 flex flex-col items-center justify-center shadow-sm border border-gray-200">
            <div className="text-6xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="text-gray-500 text-sm mt-2 text-center">
              Looks like you haven’t placed anything yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 h-12 px-8 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition cursor-pointer border-0"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <h1 className="text-4xl font-medium text-black">
              My Orders : {orders.length}
            </h1>
            {orders.map((order) => {
              const status =
                statusConfig[order.orderStatus] || statusConfig.processing;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mt-3"
                >
                  {/* Top Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wider uppercase font-semibold">
                        Order ID
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">
                          Ordered On
                        </p>

                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${status.bg} ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-4 px-6 space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="w-full sm:w-[130px] h-[130px] bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-fill"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-snug">
                              {item.productName}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              Premium Fashion Collection
                            </p>

                            <div className="flex flex-wrap gap-3 mt-4">
                              <span className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                                Size : {item.selectedSize}
                              </span>

                              <span className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                                Qty : {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between  flex-wrap gap-3">
                            <div>
                              <p className="text-2xl font-black text-gray-900">
                                ₹
                                {Math.round(item.price)?.toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-[#fafafa] px-6 py-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Address */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={15} className="text-black" />
                        <p className="text-sm font-bold text-gray-900">
                          Delivery Address
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-800">
                        {order.shippingAddress?.fullName}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 leading-6">
                        {order.shippingAddress?.houseNo},
                        {order.shippingAddress?.city},
                        {order.shippingAddress?.state} -
                        {order.shippingAddress?.pinCode}
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        📞 {order.shippingAddress?.phoneNo}
                      </p>
                    </div>

                    {/* Payment */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={15} className="text-black" />
                        <p className="text-sm font-bold text-gray-900">
                          Payment Details
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Method</span>
                          <span className="font-semibold text-gray-800">
                            {order.paymentMethod}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-500">
                          <span>Total</span>
                          <span className="font-bold text-black">
                            ₹
                            {Math.round(order.totalAmount)?.toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-500">
                          <span>Items</span>
                          <span className="font-semibold text-gray-800">
                            {order.items.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      {order.orderStatus === "processing" && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="h-11 px-6 rounded-xl bg-red-600 text-white"
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => navigate("/products")}
                        className="h-11 px-6 rounded-xl bg-black text-white"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
