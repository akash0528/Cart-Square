import CartModel from "../Model/Cart.js"

const GetCart =async (req,res) => {
    
    try {
    const cart = await CartModel.findOne({userId : req.user._id})
    .populate("items.productId")     

    res.status(200).json({cart: cart || { items: []}})
    } catch (err) {
        console.log("ERROR →", err.message);
        res.status(500).json({message:err.message})
    }
   
}


const AddCart = async (req, res) => {

  const { productId, selectedSize } = req.body;

  if (!productId || !selectedSize) {
    return res.status(400).json({ message: "productId aur selectedSize Required" });
  }

  try {
    let cart = await CartModel.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new CartModel({
        userId: req.user._id,
        items: [{ productId, selectedSize, quantity: 1 }]
      });
    } else {
      const exists = cart.items.find(
        (i) => i.productId.toString() === productId && i.selectedSize === selectedSize
      );
      if (exists) {
        exists.quantity += 1;
      } else {
        cart.items.push({ productId, selectedSize, quantity: 1 });
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated", cart });

  } catch (err) {
    console.log("ADD CART ERROR →", err.message);
    return res.status(500).json({ message: err.message });
  }
};

const removeCart = async (req,res) => {
    try {
         const cartRemove = await CartModel.findOne({userId: req.user._id})
         if(!cartRemove){
            return res.status(404).json({message:"Cart not Found"})
         }
    cartRemove.items = cartRemove.items.filter(i => i._id.toString() !== req.params.itemId)
    await cartRemove.save()
    res.status(200).json({message:"Item Removed",cartRemove})
    } catch (err) {
        res.status(500).json({
      message: err.message,
    });
    }
  
}

const updateCart = async (req, res) => {
  try {
    const { itemId, type } = req.body;

    const cart = await CartModel.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(i => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (type === "inc") {
      item.quantity += 1;
    } else if (type === "dec") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // If Qty will below 1 then remove it
        cart.items = cart.items.filter(i => i._id.toString() !== itemId);
      }
    }

    await cart.save();

    return res.status(200).json({ message: "Cart updated", cart });

  } catch (error) {
    return res.status(500).json({ message: "Cart update failed", err: error.message });
  }
};

export default {GetCart,AddCart,removeCart , updateCart}
