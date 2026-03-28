import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";

const authHeaders = () => ({
  Authorization: "Bearer " + localStorage.getItem("kp_token"),
});

export const predictYield = (formData) =>
  axios.post(`${BASE}/api/predict`, formData, { headers: authHeaders() });

export const fetchClimate = (state) =>
  axios.get(`${BASE}/api/climate?state=${encodeURIComponent(state)}`, { headers: authHeaders() });

export const saveHistory = (result, inputs) =>
  axios.post(`${BASE}/api/history`, { ...result, inputs }, { headers: authHeaders() });

export const translateText = (text) =>
  axios.get(`${BASE}/api/translate?text=${encodeURIComponent(text)}`);

export const scanStrip = (image, parameter) =>
  axios.post(`${BASE}/api/scan-strip`, { image, parameter }, { headers: authHeaders() });
