import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    stage: {
      type: String,
      required: [true, "Stage is required"],
    },
    source: {
      type: String,
      required: [true, "Source is required"],
    },
    urgency: {
      type: String,
      required: [true, "Urgency is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);