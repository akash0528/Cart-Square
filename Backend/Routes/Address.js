import Address from "../Controller/Address.js";
import express from "express"
import Auth from "../Middleware/Auth.js";

const AddressRouter = express.Router()

// Get Address
AddressRouter.get("/address",Auth,Address.GetAddress)

// Post Address
AddressRouter.post("/address",Auth,Address.CreateAddress)

//Update Address
AddressRouter.put("/address/:id",Auth,Address.updateAddress)

// Delete Address
AddressRouter.delete("/address/:id",Auth,Address.DeleteAddress)

export default AddressRouter