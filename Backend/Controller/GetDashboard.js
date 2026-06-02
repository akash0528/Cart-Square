import User from "../Model/User.js"
import Products from "../Model/Products.js"
import OrderModel from "../Model/Order.js"

const GetDashboard = async (req,res) => {
    try {
        const totalUser = await User.countDocuments()
        const totalProduct = await Products.countDocuments()
        const totalOrders = await OrderModel.countDocuments()

        const revenue = await OrderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenue[0]?.totalRevenue || 0;

        res.status(200).json({totalUser,totalProduct , totalOrders , totalRevenue})
    } catch (err) {
      
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
}

const Users = async (req,res) => {
    try {
        const TotalUser = await User.find();

        return res.status(200).json({TotalUser})
    } catch (error) {
        res.status(500).json({
      message: "Failed to fetch users",
    });
    }
}
const GetAnalytics = async (req, res) => {
  try {
    // ✅ 1. Order status counts
    const totalOrders = await OrderModel.countDocuments();
    const processing = await OrderModel.countDocuments({ orderStatus: "processing" });
    const shipped = await OrderModel.countDocuments({ orderStatus: "shipped" });
    const delivered = await OrderModel.countDocuments({ orderStatus: "delivered" });
    const cancelled = await OrderModel.countDocuments({ orderStatus: "cancelled" });

    // ✅ 2. Total revenue
    const revenueData = await OrderModel.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // ✅ 3. Monthly revenue (last 6 months)
    const monthlyRevenue = await OrderModel.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const revenueChart = monthlyRevenue.map(m => ({
      month: monthNames[m._id - 1],
      revenue: Math.round(m.revenue),
      orders: m.orders
    }));

    // ✅ 4. Top products
    const topProducts = await OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 4 },
      { $project: { name: "$_id", revenue: 1, _id: 0 } }
    ]);

    // ✅ 5. Recent orders
    const recentOrders = await OrderModel.find()
      .populate("userId", "userName email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userId totalAmount orderStatus createdAt");

    const recentActivity = recentOrders.map(o => ({
      text: `${o.userId?.userName || "User"} placed a new order`,
      amount: o.totalAmount,
      status: o.orderStatus,
      time: o.createdAt
    }));

    // ✅ 6. Top customers
    const topCustomers = await OrderModel.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 4 }
    ]);

    // Populate customer names
    const populatedCustomers = await Promise.all(
      topCustomers.map(async (c) => {
        const user = await User.findById(c._id).select("userName email");
        return {
          name: user?.userName || "Unknown",
          email: user?.email,
          totalSpent: Math.round(c.totalSpent),
          orders: c.orders
        };
      })
    );

    return res.status(200).json({
      totalOrders,
      totalRevenue,
      orderStatus: { processing, shipped, delivered, cancelled },
      revenueChart,
      topProducts,
      recentActivity,
      topCustomers: populatedCustomers
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default { GetDashboard, Users, GetAnalytics }
