import dotenv from "dotenv"
dotenv.config()


import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import UserRouter from "./Routes/User.js"
import ProductRouter from "./Routes/Products.js"
import session from "express-session"
import passport from "./config/Passport.js"

//Admin Routes
import AdminDashboardRoutes from "./Routes/GetDashoBoard.js"


import AddCarts from "./Routes/AddCarts.js";
import AddressRouter from "./Routes/Address.js"
import OrderRoutes from "./Routes/Orders.js"
import WishlistRouter from "./Routes/Wishlist.js"

const app = express()

app.set("trust proxy", 1)

app.use(cors({
    origin: "https://cart-square.vercel.app",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie:{
    secure:true,
    sameSite:"none",
    httpOnly:true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/admin",AdminDashboardRoutes)

app.use("/api/auth",UserRouter)
app.use("/api",ProductRouter)
app.use("/api/auth",AddCarts)
app.use("/api/auth",AddressRouter)
app.use("/api/auth",OrderRoutes)
app.use("/api/auth",WishlistRouter)

// Connect To DataBase
mongoose.connect(process.env.DBURL)
.then(() => {
    console.log("connected to mongodb");
    app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
    })    
})
.catch((err => {
    console.log("Mongodb Connection failed",err)
}))