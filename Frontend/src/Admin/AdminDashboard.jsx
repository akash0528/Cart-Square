import { FaChartLine } from "react-icons/fa";
import { Package, ShoppingCart, Users } from "lucide-react";
import TopBar from "../Admin/layout/TopBar";
import { useEffect, useState } from "react";
import Api from "../Api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const Statics = [
    {
      title: "Revenue",
      value: `₹ ${stats.totalRevenue?.toLocaleString() || 0}`,
      icons: <FaChartLine size={30} />,
      bg: "bg-blue-400",
    },
    {
      title: "User",
      value: stats.totalUser || 0,
      icons: <Users size={30} />,
      bg: "bg-green-400",
    },
    {
      title: "Orders",
      value: stats.totalOrders || 0,
      icons: <ShoppingCart size={30} />,
      bg: "bg-yellow-400",
    },
    {
      title: "Total Product",
      value: stats.totalProduct || 0,
      icons: <Package size={30} />,
      bg: "bg-pink-400",
    },
  ];

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await Api.get("/admin/dashboard/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStates();
  }, []);
  return (
    <div className="flex-1 min-h-screen bg-black">
      <TopBar />

      <div className="px-4 sm:px-6 mt-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        <p className="text-sm text-white mt-1">Store overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 px-4 sm:px-6">
        {Statics.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl p-5 shadow-sm bg-gradient-to-r ${item.bg} text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{item.title}</p>

                <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
              </div>

              <div className="bg-white/20 p-3 rounded-xl">{item.icons}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
