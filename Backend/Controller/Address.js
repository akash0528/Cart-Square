import AddressModel from "../Model/Address.js";

// Create Address 
const CreateAddress =async (req,res) => {
    try {
    const {fullName,phoneNo,pinCode,state, city,houseNo,landMark} = req.body;

    if(!fullName || !phoneNo || !pinCode || !state || !city || !houseNo  ){
        return res.status(400).json({message:"All fields are Mandatory"})
    }
    const address = await AddressModel.create({userId: req.user._id, fullName,phoneNo,pinCode,state,city,houseNo,landMark})

    return res.status(200).json({message:"Address Add Successfully",address})
        
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
} 

// Get Address for User
const GetAddress = async (req,res) => {
    try {
    const GetAllAddress = await AddressModel.find({userId: req.user._id})
    return res.status(200).json(GetAllAddress)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

// Delete Address 
const DeleteAddress = async (req,res) => {
    try {
     const addressDelete = await AddressModel.findOneAndDelete({
        _id : req.params.id , 
        userId: req.user._id})   

     if(!addressDelete){
        return res.status(404).json({ message: "Address not found"})
     }   

        return res.status(200).json({message:"Address Delete Successfully"})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

// update Address
const updateAddress = async (req,res) => {
    try {
     const AddressUpdate = await AddressModel.findOneAndUpdate({
        _id : req.params.id,
        userId: req.user._id}, 
    req.body, { new : true})  
    
    if(!AddressUpdate){
        return res.status(404).json({message:"Adress not found"})
    }

    return res.status(200).json({message:"Address Update Successfully"})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export default {CreateAddress,GetAddress,DeleteAddress,updateAddress}