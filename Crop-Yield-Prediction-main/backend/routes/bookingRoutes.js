import express from "express";
import {createOrder,captureOrder,getAllBookings,updateBookingStatus,deleteBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create-order",createOrder);
router.post("/capture-order",captureOrder);
router.get("/all", getAllBookings);
router.put("/update/:id", updateBookingStatus);

router.delete("/delete/:id", deleteBooking);


export default router;