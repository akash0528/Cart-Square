import { Route, Routes } from "react-router-dom";
import SignIn from "../src/Auth/Signin";
import SignUp from "../src/Auth/SignUp";
import Mainlayout from "./Layout/Mainlayout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Products from "../src/pages/Products";
import WishlistProvider from "./Context/WishlistProvider";
import Wishlist from "./pages/Wishlist";
import ProductCart from "./components/ProductCart";
import UserDashboard from "./pages/UserDashboard";
import Offer from "./pages/Offer";
import ProductLayout from "./Layout/ProductLayout";
import AddCartProvider from "./Context/AddCartProvider";
import ProductDetails from "./pages/ProductDetails";
import AdminRoutes from "./Admin/Routes/AdminRoutes";
import Address from "./PaymentMethods/Address";
import Payment from "./PaymentMethods/Payment";
import OrderSuccess from "./PaymentMethods/order";
import MyOrders from "./pages/MyOrders";
import ProtectedRoutes from "./Auth/ProtectedRoutes";
import AuthProvider from "./Context/AuthProvider";
import OtpVerify from "./Auth/OtpVerify";
import ForgotPassword from "./Auth/ForgetPassword";

const App = () => {
  return (
    <AuthProvider>
      <AddCartProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<Mainlayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/Cart" element={<ProductCart />} />

              <Route
                path="/Dashboard"
                element={
                  <ProtectedRoutes>
                    <UserDashboard />
                  </ProtectedRoutes>
                }
              />

              <Route path="/offer" element={<Offer />} />
              <Route path="/ProductDetails/:id" element={<ProductDetails />} />
              <Route path="/address" element={<Address />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-Orders" element={<MyOrders />} />

              {/* Product Combine */}
              <Route element={<ProductLayout />}>
                <Route path="/products" element={<Products />} />
              </Route>
            </Route>
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/otp" element={<OtpVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </WishlistProvider>
      </AddCartProvider>
    </AuthProvider>
  );
};

export default App;
