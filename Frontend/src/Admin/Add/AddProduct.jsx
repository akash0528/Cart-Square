import React, { useState, useRef } from "react";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../Api/axios";

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productType: "",
    actualPrice: "",
    brand: "",
    variants: [],
    category: "",
    tags: "",
    discountPercent: "",
  });

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed!");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0)
      return toast.error("Atleast Upload One Image!");
    if (formData.variants.length === 0)
      return toast.error("Atleast Pick One Size!");

    const loadingToast = toast.loading("Adding Product...");
    const finalData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "variants") {
        finalData.append("variants", JSON.stringify(value));
      } else {
        finalData.append(key, value);
      }
    });

    imageFiles.forEach((file) => finalData.append("images", file));

    try {
      await Api.post("/products", finalData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.update(loadingToast, {
        render: "Product Add Successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/admin/productManagement");
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || "Failed to add product",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-2 md:p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-[#121212] border border-white/5 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh]">
        {/* LEFT — Image Upload */}
        <div className="w-full md:w-1/3 bg-[#181818] p-6 flex flex-col items-center border-r border-white/5">
          <div className="w-full mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Add Product
            </h3>
          </div>

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="group w-full py-8 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-indigo-500 cursor-pointer flex items-center justify-center transition-all"
          >
            <div className="text-center">
              <AiOutlineCloudUpload
                size={32}
                className="text-zinc-600 mx-auto mb-2 group-hover:text-indigo-500"
              />
              <p className="text-[10px] font-bold text-zinc-500 uppercase">
                Click to Upload (Max 5)
              </p>
              <p className="text-[10px] text-zinc-600 mt-1">
                {imageFiles.length}/5 images selected
              </p>
            </div>
          </div>

          {/* Previews Grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3 w-full">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFiles((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      );
                      setPreviews((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <AiOutlineClose size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>

        {/* RIGHT — Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase italic text-white">
              Add Product
            </h2>
            <AiOutlineClose
              className="cursor-pointer hover:text-white"
              onClick={() => navigate("/admin/productManagement")}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "ProductName",
                  field: "productName",
                  type: "text",
                  ph: "Nike",
                },
                {
                  label: "ActualPrice (₹)",
                  field: "actualPrice",
                  type: "number",
                  ph: "199",
                },
                {
                  label: "ProductType",
                  field: "productType",
                  type: "text",
                  ph: "T-Shirt",
                },
                { label: "Brand", field: "brand", type: "text", ph: "Adidas" },
                {
                  label: "Category",
                  field: "category",
                  type: "text",
                  ph: "Men,Women",
                },
                { label: "Tags", field: "tags", type: "text", ph: "Trending" },
                {
                  label: "Discount %",
                  field: "discountPercent",
                  type: "number",
                  ph: "20",
                },
              ].map((item) => (
                <div key={item.field} className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">
                    {item.label}
                  </label>
                  <input
                    required={item.field !== "discountPercent"}
                    type={item.type}
                    placeholder={item.ph}
                    className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, [item.field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <label className="text-[10px] font-bold text-zinc-500 uppercase">
              Sizes & Stock
            </label>
            <div className="flex flex-col gap-3">
              {["S", "M", "L", "XL"].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const exists = formData.variants.find(
                        (v) => v.size === s,
                      );
                      setFormData({
                        ...formData,
                        variants: exists
                          ? formData.variants.filter((v) => v.size !== s)
                          : [...formData.variants, { size: s, stock: 0 }],
                      });
                    }}
                    className={`w-12 py-1 rounded font-bold text-sm ${
                      formData.variants.find((v) => v.size === s)
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-700 text-zinc-400"
                    }`}
                  >
                    {s}
                  </button>

                  {formData.variants.find((v) => v.size === s) && (
                    <input
                      type="number"
                      min={0}
                      placeholder="Stock"
                      className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm w-24 focus:border-indigo-500 outline-none"
                      value={
                        formData.variants.find((v) => v.size === s)?.stock || ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          variants: formData.variants.map((v) =>
                            v.size === s
                              ? { ...v, stock: Number(e.target.value) }
                              : v,
                          ),
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
              >
                SAVE PRODUCT
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/productManagement")}
                className="px-6 py-3 border border-white/10 rounded-2xl font-bold hover:bg-red-500/10 hover:text-red-500"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
