import Feedback from "../models/Feedback.js";
//for user
export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

//for admin 
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};