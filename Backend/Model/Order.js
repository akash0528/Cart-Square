import {Schema,model} from "mongoose"

const OrderSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"user"
  },
  items:[{
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Products"
    },
    productName:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    quantity:{
      type:Number,
      required: true,
      default:1
    },
    selectedSize:{
     type: String,
     required:true
    },
    price:{
      type:Number,
      required:true
    },
    actualPrice:{
      type:Number,
      
    }
  }],
  shippingAddress :{
    type: Schema.Types.ObjectId,
    ref: "Address",
    required:true
  },  

  totalAmount:Number,

  paymentMethod:{
    type: String,
    enum:["COD","ONLINE"],
    default:"COD"
  },
  paymentStatus:{
    type: String,
    enum : ["pending","paid","failed"],
    default:"pending"
  },
  orderStatus:{
    type:String,
    enum:["processing","shipped","delivered","cancelled"],
    default:"processing"
  }
},{timestamps:true})

const OrderModel = model("order",OrderSchema)

export default OrderModel;