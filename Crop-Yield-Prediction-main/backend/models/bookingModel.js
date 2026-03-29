import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

name:String,
phone:String,
email:String,
address:String,
pincode:String,

devices:Number,
amount:Number,

paypalOrderId:String,
status: {
  type: String,
  enum: ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"],
  default: "Placed",
},

},{timestamps:true});

export default mongoose.model("Booking",bookingSchema);