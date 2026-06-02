import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import wishListContext from "../Context/WishlistContext";
import { Heart } from "lucide-react";
import Api from "../Api/axios";
import { useNavigate } from "react-router-dom";

const NewCollection = () => {
  const [NewArrivalData, setArrivalData] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { wishlist, toggleWishlist } = useContext(wishListContext);
  const navigate = useNavigate();

  const fetchCollection = async () => {
    try {
      const res = await Api.get("/trending", {
        withCredentials: true,
      });
      setArrivalData(res.data.newArrivals);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <h1 className="text-3xl md:text-[80px]  font-bold text-black text-start leading-none">
          NEW ARRIVALS
        </h1>

        <div className="relative  py-6 flex justify-center items-center">
          {/* ✅ Left Arrow */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-5 z-20">
            <button
              ref={prevRef}
              className=" bg-gray-100 shadow-md hover:bg-gray-200 rounded-lg p-3 transition cursor-pointer "
            >
              <FaArrowLeft size={20} className="text-gray-700" />
            </button>
          </div>

          {/* ✅ Right Arrow */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-5 z-20 ">
            <button
              ref={nextRef}
              className=" bg-gray-100 shadow-md hover:bg-gray-200 rounded-lg p-3 transition cursor-pointer "
            >
              <FaArrowRight size={20} className="text-gray-700" />
            </button>
          </div>

          <Swiper
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            slidesPerView={4}
            spaceBetween={8}
            className="w-full"
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 4, spaceBetween: 15 },
            }}
          >
            {NewArrivalData.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="flex flex-col  w-full cursor-pointer bg-white  overflow-hidden hover:shadow-lg transition-all duration-300 pb-4 border-black"
                  key={index}
                  onClick={() => navigate(`/ProductDetails/${item._id}`)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.Title}
                    className=" w-full h-52 sm:h-60 md:h-64 object-fill  "
                  />

                  <div className="flex justify-between px-2 pt-2">
                    <p className="font-bold text-sm sm:text-base line-clamp-2">
                      {item.productName}
                    </p>
                    <Heart
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className={`cursor-pointer shrink-0 mt-0.5 transition-colors ${
                        wishlist.find(
                          (w) => w._id?.toString() === item._id?.toString(),
                        )
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex gap-2 mt-2 px-2">
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      ₹{Math.round(item.productPrice)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-gray-400 line-through">
                        ₹{item.actualPrice}
                      </span>

                      <span className="text-[12px] font-bold text-red-500">
                        -{item.discountPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default NewCollection;
