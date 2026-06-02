import { useContext, useEffect, useState } from "react";
import AddCartContext from "./AddCartContext";
import AuthContext from "./AuthContext";
import Api from "../Api/axios";

const AddCartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await Api.get("/auth/carts", { withCredentials: true });
      setCart(res.data.cart?.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addCart = async (item) => {
    try {
      await Api.post(
        "/auth/carts",
        {
          productId: item.productId || item._id,
          selectedSize: item.selectedSize,
        },
        { withCredentials: true },
      );
      fetchCart();
    } catch (err) {
      console.log("Add cart error", err.message);
    }
  };

  const removeCart = async (itemId) => {
    setCart((prev) => prev.filter((item) => item._id !== itemId));
    try {
      await Api.delete(`/auth/carts/${itemId}`, { withCredentials: true });
    } catch (error) {
      console.log("Remove error", error.message);
      fetchCart();
      c;
    }
  };

  const updateQuantity = async (itemId, type) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === itemId) {
            if (type === "inc") return { ...item, quantity: item.quantity + 1 };
            if (type === "dec" && item.quantity > 1)
              return { ...item, quantity: item.quantity - 1 };
            if (type === "dec" && item.quantity === 1) return null;
          }
          return item;
        })
        .filter(Boolean),
    );

    try {
      await Api.put(
        `/auth/carts/${itemId}`,
        { itemId, type },
        { withCredentials: true },
      );
    } catch (error) {
      console.log("Update error", error.message);
      fetchCart();
    }
  };

  const totalPrice = cart.reduce((acc, item) => {
    const price = item.productId?.productPrice || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const mrpTotal = cart.reduce((a, item) => {
    const original =
      item.productId?.actualPrice || // ✅ actualPrice
      item.productId?.productPrice ||
      0;
    return a + original * (item.quantity || 1);
  }, 0);

  const discount = mrpTotal - totalPrice;
  return (
    <AddCartContext.Provider
      value={{
        cart,
        addCart,
        removeCart,
        updateQuantity,
        totalPrice,
        setCart,
        discount,
        mrpTotal,
      }}
    >
      {children}
    </AddCartContext.Provider>
  );
};

export default AddCartProvider;
