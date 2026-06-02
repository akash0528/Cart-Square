import { useContext, useEffect, useState } from "react";
import wishListContext from "./WishlistContext";
import AuthContext from "./AuthContext";
import Api from "../Api/axios";

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      try {
        const res = await Api.get("/auth/wishlist", { withCredentials: true });
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (item) => {
    try {
      const exists = wishlist.some(
        (w) => (w._id || w)?.toString() === item._id?.toString(),
      );

      if (exists) {
        setWishlist((prev) =>
          prev.filter((w) => (w._id || w)?.toString() !== item._id?.toString()),
        );
      } else {
        setWishlist((prev) => [...prev, item]);
      }

      await Api.post(
        "/auth/wishlist",
        { productId: item._id },
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
      const res = await Api.get("/auth/wishlist", { withCredentials: true });
      setWishlist(res.data.wishlist || []);
    }
  };
  return (
    <wishListContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </wishListContext.Provider>
  );
};

export default WishlistProvider;
