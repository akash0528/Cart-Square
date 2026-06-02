import Wishlist from "../Controller/Wishlist.js";
import express from "express"
import Auth from "../Middleware/Auth.js";

const WishlistRouter = express.Router()

WishlistRouter.post("/wishlist", Auth, Wishlist.ToggleWishlist);
WishlistRouter.get("/wishlist", Auth, Wishlist.GetWishlist);

export default WishlistRouter;
