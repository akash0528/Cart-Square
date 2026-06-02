import ProductsModel from "../Model/Products.js";
import cloudinary from "../config/Cloudinary.js"

//Post Product
// Products.js controller
const Product = async (req, res) => {
  try {
    const uploadedImages = await Promise.all(
  req.files.map(file => cloudinary.uploader.upload(file.path))
);

    const imageUrls = uploadedImages.map(img => img.secure_url);

    const body = { ...req.body };

    // ⭐ variants parse karo — frontend JSON string bhejta hai
    let variants = [];
    if (body.variants) {
      variants = JSON.parse(body.variants);
    }

    const actualPrice = Number(body.actualPrice)

    const discountPercent = Number(body.discountPercent || 0)

    const discountPrice = (actualPrice * discountPercent) / 100;

    const finalPrice = actualPrice - discountPrice 

    const productsAdd = await ProductsModel.create({
      productName: body.productName,

      productPrice: finalPrice,  // final price for product

      productType: body.productType,

      actualPrice: actualPrice,

      brand: body.brand,

      category: body.category,

      variants,                          // ⭐ parsed variants

      discountPercent : discountPercent,

      tags : body.tags,

      images: imageUrls,

    });


    return res.status(201).json({ message: "Product created", productsAdd });

  } catch (error) {
    console.log("ERROR →", error.message);
    return res.status(500).json({ message: "Product Didn't Add", err: error.message });
  }
};


// Get Product
const ProductsAll = async (req,res) => {
    try {
        const Products = await ProductsModel.find();
        return res.status(200).json({message:"All Products are shown",Products})
    } catch (error) {
        return res.status(500).json({message:"All Products are not shown", err:error})
    }
}

// Update Products
const UpdateProducts = async (req,res) => {
    try {
        const product = await ProductsModel.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"Products not found"})
        }

        const updatedData = {...req.body}

        if(req.file){
            if(product.public_id){
                await cloudinary.uploader.destroy(product.public_id);
            }
            const uploadImage = await cloudinary.uploader.upload((req.file.path));
            updatedData.image = uploadImage.secure_url
            updatedData.public_id = uploadImage.public_id
        }

        const ProductsUpdate = await ProductsModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new:true , runValidators:true}
        )
        return res.status(200).json({message:"Products Update Successfully",ProductsUpdate})
    } catch (error) {
        return res.status(500).json({message:"Products not Updated",err:error})
    }
}

//Delete Products

const DeleteProducts = async (req,res) => {
    try {
        const products = await ProductsModel.findById(req.params.id)
        if(!products){
            return res.status(404).json({message:"Products not found"})
        }
        
        //Delete cloudinary image
        if(products.public_id){
           const result = await cloudinary.uploader.destroy(products.public_id)
           console.log("cloudinary delete",result);
           
        }
        // then it will delete product
       await ProductsModel.findByIdAndDelete(req.params.id)

      return res.status(200).json({message:"Products Delete Successfully",products})  

    } catch (error) {
        return res.status(500).json({message:"Product didn't Delete",err:error})
    }
}

const GetAllProductData = async (req,res) => {
    try {
        const getAllData = await ProductsModel.findById(req.params.id)

        if(!getAllData){
             return res.status(404).json({
        message: "Product not found",
      });
        }
        return res.status(200).json({message:"Products fetch Successfully",getAllData})
    } catch (err) {
         return res.status(500).json({message:"All Products are not shown", err:error})
    }
    
}

// Top Collection Controller
const TopCollection = async (req,res) => {
    try {
       const collection = await ProductsModel.find({tags:"Top Collection"}).limit(4) 

       return res.status(200).json({collection})
    } catch (err) {
        return res.status(500).json({message:err.error})
    }
}

const NewArrivals = async (req,res) => {
    try {
        const newArrivals = await ProductsModel.find({tags:"New Arrivals"}).sort({createAt:-1})
        return res.status(200).json({newArrivals})
    } catch (err) {
        return res.status(500).json({message:err.error})
    }
    
}

const BestSeller = async (req,res) => {
    try {
       const BestProduct = await ProductsModel.find({tags:"BestSeller"}) 
       return res.status(200).json({BestProduct})
    } catch (err) {
        return res.status(500).json({message:err.error})
    }
}
 
export default {Product,ProductsAll,UpdateProducts,DeleteProducts,GetAllProductData , TopCollection,NewArrivals , BestSeller}