import {model, Schema} from "mongoose"


const ProductSchema = new Schema({
        productName:{
            type:String,
            required:[true,"Product is required"]
        },
        productPrice:{
            type:Number,
            required:true,
            min:0
        },
        brand:{
            type:String,
            required:true
        },
        actualPrice:{
            type:Number,
            required:true
        },
        productType:{           
            type:String,
            required:true
        },
        images:[{
            type:String,   
        }],
        variants:[
           {
      size: { type: String, required: true },
      stock: { type: Number, required: true, min: 0, default: 0 },
    }
            ],
        category:{
            type:String,
            required:true
        },
        tags: {
             type: [String],
            default: []
        },
        discountPercent: { type: Number, default: 0, min: 0, max: 100 }
},{timestamps:true})


const ProductsModel = model("Products",ProductSchema)

export default ProductsModel;