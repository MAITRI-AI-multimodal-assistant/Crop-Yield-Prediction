import axios from "axios";
import Booking from "../models/bookingModel.js";

const base = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64");

  const response = await axios.post(
    `${base}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const deviceCount = Number(products);

    if (!deviceCount || deviceCount <= 0) {
      return res.status(400).json({ error: "Invalid product quantity" });
    }

    const amount = deviceCount * 1000;
    const token = await generateAccessToken();

    const order = await axios.post(
      `${base}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ id: order.data.id });
  } catch (err) {
    console.error("PayPal Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Error creating PayPal order" });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID, name, phone, email, address, pincode, products } = req.body;

    const deviceCount = Number(products);
    const amount = deviceCount * 1000;

    const token = await generateAccessToken();

    const capture = await axios.post(
      `${base}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (capture.data.status !== "COMPLETED") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const existing = await Booking.findOne({ paypalOrderId: orderID });
    if (existing) {
      return res.json({ success: true, booking: existing });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      address,
      pincode,
      devices: deviceCount,
      amount,
      paypalOrderId: orderID,
      status: "Confirmed",
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("PayPal Capture Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment capture failed" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};