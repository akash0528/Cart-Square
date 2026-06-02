import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../Admin/layout/AdminLayout";
import AdminDashboard from "../../Admin/AdminDashboard";
import ProductManagement from "../../Admin/ProductManagement";
import Users from "../../Admin/Users";
import Orders from "../../Admin/Orders";
import Analytics from "../../Admin/Analytics";
import Setting from "../Setting/Setting";
import AddProduct from "../Add/AddProduct";

const AdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Default Page */}
          <Route index element={<AdminDashboard />} />

          {/* AdminDashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="productManagement" element={<ProductManagement />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="statics" element={<Analytics />} />
          <Route path="setting" element={<Setting />} />

          <Route path="addProduct" element={<AddProduct />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;
