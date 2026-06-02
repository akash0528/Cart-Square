import OrderModel from "../Model/Order.js";
import CartModel from "../Model/Cart.js";
import Address from "../Model/Address.js"
import ProductsModel from "../Model/Products.js";

const CreateOrder = async (req, res) => {
 
  try {
    const { addressId, totalAmount, paymentMethod ,paymentStatus} = req.body; 

    const cart = await CartModel.findOne({ userId: req.user._id })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is Empty" });
    }

    // Checking If Product Stock Existing or Not
    for (const item of cart.items) {
  const product = item.productId;
  const variant = product.variants.find(v => v.size === item.selectedSize);
  
  if (!variant) {
    return res.status(400).json({ 
      message: `Size ${item.selectedSize} not available for ${product.productName}` 
    });
  }
  
  if (variant.stock < item.quantity) {
    return res.status(400).json({ 
      message: `${product.productName} (${item.selectedSize}) out of stock` 
    });
  }
}

    const orderItems = cart.items.map((item) => ({
      productId:    item.productId._id,
      productName: item.productId.productName,
      productImage: item.productId.images?.[0],
      quantity:     item.quantity,
      selectedSize: item.selectedSize,
      price:        item.productId.productPrice,
      actualPrice : item.productId.actualPrice
    }));

    
    const payment = await OrderModel.create({
      userId:          req.user._id,
      items:           orderItems,
      shippingAddress: addressId, // 
      totalAmount,
      paymentMethod:   paymentMethod || "COD",
      paymentStatus:   paymentStatus || "pending",
      orderStatus:     "processing",
    });

    // Stock Deduct 
    for (const item of cart.items) {
  await ProductsModel.findOneAndUpdate(
    { 
      _id: item.productId._id,
      "variants.size": item.selectedSize  
    },
    { 
      $inc: { "variants.$.stock": -item.quantity } 
    }
  );
}

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Order created successfully",
      payment,
    });

  } catch (err) {
    console.log("Order error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


const GetOrders = async (req,res) => {
    try {
    const AllGetOrders = await OrderModel.find({userId:req.user._id})
    .populate("shippingAddress")
   .select("items createdAt orderStatus shippingAddress totalAmount paymentMethod");

    return res.status(200).json({AllGetOrders})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

const GetSingleOrder = async (req,res) => {
    try {
     const  singlePayment = await OrderModel.findOne({
        _id : req.params.id,
        userId: req.user._id
    })
    .populate("items.productId")
    .populate("shippingAddress"); 
    
     if (!singlePayment) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(singlePayment);
    } catch (err) {
         return res.status(500).json({
      message: err.message,
    });
    }
}

const updateOrder = async (req,res) => {
    try {
    const {orderStatus,paymentStatus}  = req.body;

    const paymentUpdate = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            orderStatus,
            paymentStatus
        },
        {new:true}
    )
    
    if(!paymentUpdate){
         return res.status(404).json({
        message: "Order not found",
      });
    }

     return res.status(200).json({
      message: "Order updated successfully",
      paymentUpdate
    });

    } catch (err) {
         return res.status(500).json({
      message: err.message,
    });
    }
}

//AllOrdes for Admin 
const GetAllOrders = async (req,res) => {
  try {
   const AllOrders = await OrderModel.find({})
  .populate("shippingAddress")
  .populate("userId", "email userName")
  .sort({createdAt:-1})
  
  return res.status(200).json({AllOrders})
  } catch (err) {
    console.log("GET ALL ORDERS ERROR:", err);
     return res.status(500).json({ message: err.message });
  }
  
}

// Cancel Order Controller
const CancelOrder = async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // delivered order cannot be cancel
    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Delivered order can't be cancelled",
      });
    }

    order.orderStatus = "cancelled";

    await order.save();

    return res.status(200).json({
      message: "Order Cancelled",
      order,
    });
  } catch (err) {
     console.log("FULL ERROR:", err);
  console.log("MESSAGE:", err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export default {GetOrders,GetSingleOrder,updateOrder,CreateOrder ,GetAllOrders, CancelOrder}