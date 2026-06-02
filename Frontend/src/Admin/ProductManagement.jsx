import BlackShirt from "../assets/BlackShirt.webp";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api/axios";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [open, setOpen] = useState(false);
  const [productdata, setProductData] = useState([]);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const res = await Api.get("/Products");
      console.log("API RESPONSE 👉", res.data);
      setProductData(res.data.Products);
    } catch (er) {
      toast.error("Library sync failed");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are You Sure To Delete!")) {
      try {
        await Api.delete(`/product/${id}`, {
          withCredentials: true,
        });
        toast.success("Product Delete");
        fetchProduct();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <>
      <div className="px-4 py-6 bg-[#0f0f13]">
        <div className="flex justify-between flex-wrap gap-3 ">
          <div className="">
            <h2 className="text-3xl font-medium px-2 text-white">
              Product Management
            </h2>
            <h4 className="text-sm px-2 text-zinc-500">
              Manage Your Product catelog
            </h4>
          </div>

          <button
            className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-violet-500 
        hover:opacity-90 transition text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
            onClick={() => navigate("/admin/addProduct")}
          >
            <AiOutlinePlus size={18} />
            Add Production
          </button>
        </div>

        <div className="flex-1 mt-4 px-2">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={15}
            />
            <input
              type="text"
              placeholder="Search Products..."
              className="w-full sm:w-96 h-10 bg-[#18181f] border border-[#27272f] rounded-lg pl-9 pr-4 text-sm text-white
           placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-2 py-6">
          {productdata.map((item, index) => (
            <div
              key={index}
              className="group bg-[#18181f] border border-[#27272f] cursor-pointer rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.images?.[0]}
                  alt={item.productName}
                  className="w-full h-60 object-fill group-hover:scale-105 transition duration-500"
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer">
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Name + Brand */}
                <div>
                  <h2 className="text-lg font-semibold text-white line-clamp-1">
                    {item.productName}
                  </h2>

                  <p className="text-sm text-zinc-400">{item.brand}</p>
                </div>

                {/* Size Variants */}
                <div className="flex flex-wrap gap-2">
                  {item.variants?.map((v) => (
                    <span
                      key={v.size}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold
                ${
                  v.stock === 0
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}
                    >
                      {v.size} : {v.stock === 0 ? "Out" : v.stock}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ₹{Math.round(item.productPrice)}
                    </p>

                    {item.actualPrice && (
                      <p className="text-sm text-zinc-500 line-through">
                        ₹{item.actualPrice}
                      </p>
                    )}
                  </div>

                  <div>
                    {item.variants?.every((v) => v.stock === 0) ? (
                      <span className="text-red-400 text-sm font-semibold">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="text-green-400 text-sm font-semibold">
                        {item.variants?.reduce((s, v) => s + v.stock, 0)} In
                        Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
