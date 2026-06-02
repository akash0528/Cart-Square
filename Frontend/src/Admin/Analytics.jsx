import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { ClipLoader } from "react-spinners";
import Api from "../Api/axios";

const TABS = ["7D", "30D", "90D", "1Y"];

const avatarGradients = [
  "from-indigo-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-yellow-400 to-orange-400",
];

const Analytics = () => {
  const [activeTab, setTab] = useState("30D");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await Api.get("/admin/analytics", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-white">
        <ClipLoader loading={true} color="#ffffff" />
      </div>
    );

  const totalRevenue = data?.totalRevenue || 0;
  const totalOrders = data?.totalOrders || 0;
  const revenueChart = data?.revenueChart || [];
  const topProducts = data?.topProducts || [];
  const topCustomers = data?.topCustomers || [];
  const recentActivity = data?.recentActivity || [];

  const maxSpent = topCustomers[0]?.totalSpent || 1;

  const pieData = [
    {
      name: "Processing",
      value: data?.orderStatus?.processing || 0,
      color: "#fbbf24",
    },
    {
      name: "Shipped",
      value: data?.orderStatus?.shipped || 0,
      color: "#22d3ee",
    },
    {
      name: "Delivered",
      value: data?.orderStatus?.delivered || 0,
      color: "#22c55e",
    },
    {
      name: "Cancelled",
      value: data?.orderStatus?.cancelled || 0,
      color: "#f87171",
    },
  ];

  const statusDotColor = {
    processing: "#fbbf24",
    shipped: "#22d3ee",
    delivered: "#22c55e",
    cancelled: "#f87171",
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] px-6 py-7 text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Your store performance overview
          </p>
        </div>
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-4 rounded-lg border text-xs font-semibold transition-all ${
                activeTab === t
                  ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
                  : "bg-[#18181f] border-[#27272f] text-zinc-500 hover:text-indigo-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            dot: "bg-indigo-500",
          },
          { label: "Total Orders", value: totalOrders, dot: "bg-cyan-400" },
          {
            label: "Delivered",
            value: data?.orderStatus?.delivered || 0,
            dot: "bg-green-500",
          },
          {
            label: "Cancelled",
            value: data?.orderStatus?.cancelled || 0,
            dot: "bg-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#18181f] border border-[#27272f] rounded-2xl px-5 py-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
        <div className="bg-[#18181f] border border-[#27272f] rounded-2xl p-5">
          <p className="text-sm font-bold text-zinc-100">Revenue Overview</p>
          <p className="text-xs text-zinc-500 mb-4">Monthly revenue</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueChart}>
              <CartesianGrid
                stroke="#1e1e27"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#4b4b5a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4b4b5a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181f",
                  border: "1px solid #27272f",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 3"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[
              ["#6366f1", "Revenue"],
              ["#22d3ee", "Orders"],
            ].map(([c, l]) => (
              <div
                key={l}
                className="flex items-center gap-1.5 text-xs text-zinc-500"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: c }}
                />
                {l}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#18181f] border border-[#27272f] rounded-2xl p-5">
          <p className="text-sm font-bold text-zinc-100">Order Status</p>
          <p className="text-xs text-zinc-500 mb-4">Distribution</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#18181f",
                  border: "1px solid #27272f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {pieData.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </div>
                <span className="font-bold text-zinc-200">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-[#18181f] border border-[#27272f] rounded-2xl p-5">
          <p className="text-sm font-bold text-zinc-100">Top Products</p>
          <p className="text-xs text-zinc-500 mb-4">By revenue</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={topProducts} layout="vertical" barSize={8}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181f",
                  border: "1px solid #27272f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="revenue" radius={4}>
                {topProducts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#6366f1", "#22d3ee", "#f472b6", "#fb923c"][i % 4]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers */}
        <div className="bg-[#18181f] border border-[#27272f] rounded-2xl p-5">
          <p className="text-sm font-bold text-zinc-100">Top Customers</p>
          <p className="text-xs text-zinc-500 mb-4">Highest spenders</p>
          <div className="flex flex-col gap-3">
            {topCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradients[i % 4]} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {c.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-100">
                    {c.name}
                  </p>
                  <div className="h-1.5 bg-[#1e1e27] rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${avatarGradients[i % 4]}`}
                      style={{ width: `${(c.totalSpent / maxSpent) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-300">
                  ₹{c.totalSpent}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#18181f] border border-[#27272f] rounded-2xl p-5">
          <p className="text-sm font-bold text-zinc-100">Recent Activity</p>
          <p className="text-xs text-zinc-500 mb-4">Latest orders</p>
          <div className="flex flex-col">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-[#1e1e27] last:border-0"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: statusDotColor[a.status] || "#6366f1" }}
                />
                <p className="text-xs text-zinc-400 flex-1">{a.text}</p>
                <p className="text-[11px] text-zinc-600 shrink-0">
                  ₹{Math.round(a.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
