import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["crops", "seeds", "fertilisers", "equipment", "pesticides"],
      required: true,
    },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    quantity: { type: String },
    seller: { type: String },
    state: { type: String },
    image: { type: String },
    badge: { type: String },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);