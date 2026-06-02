import WishlistModel from "../Model/Wishlist.js"

const ToggleWishlist = async (req,res) => {
    try {
     const {productId} = req.body  
     
     let wishlist = await WishlistModel.findOne({userId:req.user._id})

     if(!wishlist){
        wishlist = await WishlistModel.create({
            userId: req.user._id,
            products : [productId]
        })
        return res.status(200).json({message: "Added to wishlist", wishlist})
     }

  const exist = wishlist.products
  .map(p => p.toString())
  .includes(productId);

if(exist) {  // ✅ if exist then remove it
  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );
} else {     // if not Exist Then add it
  wishlist.products.push(productId);
}

await wishlist.save();
return res.status(200).json({ message: exist ? "Removed" : "Added", wishlist });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const GetWishlist = async (req,res) => {
    try {
      
     const wishlist = await WishlistModel.findOne({userId:req.user._id})   
     .populate("products")

     return res.status(200).json({ wishlist: wishlist?.products || [] });
    } catch (err) {
         return res.status(500).json({ message: err.message });
    }
}

export default {ToggleWishlist,GetWishlist}