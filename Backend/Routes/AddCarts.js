import Cart from "../Controller/Cart.js";
import express from "express"
import Auth from "../Middleware/Auth.js";

const AddCarts = express.Router()

AddCarts.get("/carts",Auth,Cart.GetCart);

AddCarts.post("/carts",Auth,Cart.AddCart);

AddCarts.delete("/carts/:itemId",Auth ,Cart.removeCart);

AddCarts.put("/carts/:itemId",Auth,Cart.updateCart)


export default AddCarts