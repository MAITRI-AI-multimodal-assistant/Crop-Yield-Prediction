import express from "express";
import User from "../models/user.js";
import Product from "../models/productModel.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments();
    const totalListings = await Product.countDocuments();

    res.json({
      stats: [
        { label:"Total Users",     value: String(totalUsers),    delta:"+0%", color:"from-green-500 to-emerald-600",  glow:"rgba(0,166,81,0.3)"   },
        { label:"Predictions",     value: "—",                   delta:"+0%", color:"from-emerald-600 to-green-700",  glow:"rgba(5,150,105,0.3)"  },
        { label:"Listings",        value: String(totalListings), delta:"+0%", color:"from-teal-500 to-green-600",     glow:"rgba(20,184,166,0.3)" },
        { label:"Avg Yield (t/ha)",value: "—",                   delta:"+0%", color:"from-green-400 to-teal-500",     glow:"rgba(0,166,81,0.3)"   },
      ],
      activity: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;