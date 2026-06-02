import Products from "../Controller/Products.js";
import express from "express"
import upload from "../Middleware/uploads.js";

const ProductRouter = express.Router()

ProductRouter.get("/products",Products.ProductsAll)

ProductRouter.post("/products",upload.array("images",5),Products.Product)

ProductRouter.get("/product/:id",Products.GetAllProductData)

ProductRouter.put("/product/:id",upload.array("images",5),Products.UpdateProducts)

ProductRouter.delete("/product/:id",Products.DeleteProducts)

ProductRouter.get("/top-Collection",Products.TopCollection)

ProductRouter.get("/trending",Products.NewArrivals)

ProductRouter.get("/BestSeller",Products.BestSeller);

export default ProductRouter;