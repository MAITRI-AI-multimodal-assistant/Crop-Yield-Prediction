import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";

const authHeaders = () => ({
  Authorization: "Bearer " + localStorage.getItem("kp_token"),
});

export const getListings = (params = {}) =>
  axios.get(`${BASE}/api/market/listings`, { params, headers: authHeaders() });

export const createListing = (data) =>
  axios.post(`${BASE}/api/market/listings`, data, { headers: authHeaders() });

export const getListing = (id) =>
  axios.get(`${BASE}/api/market/listings/${id}`, { headers: authHeaders() });

export const placeOrder = (data) =>
  axios.post(`${BASE}/api/market/orders`, data, { headers: authHeaders() });

export const getMyOrders = () =>
  axios.get(`${BASE}/api/market/orders/mine`, { headers: authHeaders() });

export const updateOrderStatus = (id, status) =>
  axios.put(`${BASE}/api/market/orders/${id}`, { status }, { headers: authHeaders() });

export const createPayment = (data) =>
  axios.post(`${BASE}/api/market/payment`, data, { headers: authHeaders() });

export const verifyPayment = (data) =>
  axios.post(`${BASE}/api/market/verify-pay`, data, { headers: authHeaders() });
