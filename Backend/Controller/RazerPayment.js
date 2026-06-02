import dotenv from "dotenv"
dotenv.config()
import razorPay from "../config/Razer.js";

const CreateRazorPay = async (req,res) => {
    try {
     const {amount} = req.body;
     
     const options = {
        amount : amount * 100,
        currency : "INR",
        receipt : `receipt_${Date.now()}`
     }

     const order = await razorPay.orders.create(options);
     return res.status(200).json(order)
    } catch (err) {
         return res.status(500).json({
      message: err.message
    });
    }
}

export default CreateRazorPay;