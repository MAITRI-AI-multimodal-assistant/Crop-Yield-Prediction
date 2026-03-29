import express from "express";
import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/my", getMyOrders);

export default router;