import Order from "../Controller/Order.js";
import CreateRazorPay from "../Controller/RazerPayment.js";
import Auth from "../Middleware/Auth.js";
import express from "express"

const OrderRoutes = express.Router()

OrderRoutes.get("/orders",Auth,Order.GetOrders)

OrderRoutes.get("/payment/:id",Auth,Order.GetSingleOrder)


OrderRoutes.put("/payment/:id",Auth,Order.updateOrder)

// Razorpay Order Create
OrderRoutes.post("/create-order", Auth, CreateRazorPay);

OrderRoutes.post("/order",Auth,Order.CreateOrder)

// Cancel Order Route
OrderRoutes.put("/order/cancel/:id",Auth,Order.CancelOrder)

export default OrderRoutes