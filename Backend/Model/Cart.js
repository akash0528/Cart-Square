import {Schema,model } from "mongoose";

const CartSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items : [{
        productId :{
            type: Schema.Types.ObjectId,
            ref : "Products",
            required : true
        },
        selectedSize : {
            type: String,
            required: true
        },
        quantity : {
            type: Number,
            default : 1,
            min:1
        },

    }]
}, {timestamps: true})

const CartModel = model("Cart", CartSchema)

export default CartModel;