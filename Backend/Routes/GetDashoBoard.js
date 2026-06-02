import express from "express"
import AdminDashboard from "../Controller/GetDashboard.js"
import order from "../Controller/order.js"
import Auth from "../Middleware/Auth.js"

const AdminDashboardRoutes = express.Router()

AdminDashboardRoutes.get("/dashboard/stats",Auth,AdminDashboard.GetDashboard)

AdminDashboardRoutes.get("/users",Auth,AdminDashboard.Users)

AdminDashboardRoutes.get("/orders",Auth,order.GetAllOrders)

AdminDashboardRoutes.get("/analytics", Auth, AdminDashboard.GetAnalytics)

export default AdminDashboardRoutes;