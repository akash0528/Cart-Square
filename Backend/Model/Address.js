import {Schema,model} from "mongoose"

const AddressSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  fullName:{
    type:String,
    required: true
  },
  phoneNo:{
    type: String,
    required : true
  } ,
  pinCode:{
    type: String,
    required: true
  },
  state:{
    type:String,
    required: true
  },
  city:{
    type:String,
    required : true
  }, 
  houseNo : {
    type: String,
    required: true
  },
  landMark:{
    type:String,
  },
  isdefault:{
    type:Boolean,
    required: false
  }
},{timestamps:true})


const AddressModel = model("Address", AddressSchema)

export default AddressModel