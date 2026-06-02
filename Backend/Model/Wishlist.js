import {Schema, model} from "mongoose"

const WishListSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"user"
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:"Products"
    }]
},{timestamps:true})

const WishlistModel = model("Wishlist",WishListSchema)

export default WishlistModel