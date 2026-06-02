import Navbar from "../src/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../src/Layout/Footer";

const Mainlayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Mainlayout;
