import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:8000";

const authHeaders = () => ({
  Authorization: "Bearer " + localStorage.getItem("kp_token"),
});

export const predictYield = (formData) => {
  const payload = {
    Crop:             formData.crop,
    Crop_Year:        Number(formData.crop_year),
    Season:           formData.season,
    State:            formData.state,
    Area:             Number(formData.area),
    Annual_Rainfall:  Number(formData.annual_rainfall),
    Fertilizer:       Number(formData.fertilizer),
    Pesticide:        Number(formData.pesticide),
    N:                Number(formData.N),
    P:                Number(formData.P),
    K:                Number(formData.K),
    ph:               Number(formData.ph),
    humidity:         Number(formData.humidity),
    rainfall_nasa:    Number(formData.annual_rainfall), // same source, separate key Flask needs
    temperature:      Number(formData.temperature),
    ndvi:             Number(formData.ndvi) || null,    // sent for reference; Flask recomputes internally
  };

  return axios.post(`${BASE}/api/predict`, payload, { headers: authHeaders() });
};

export const fetchClimate = (state) =>
  axios.get(`${BASE}/api/climate?state=${encodeURIComponent(state)}`, {
    headers: authHeaders(),
  });

export const saveHistory = (result, inputs) =>
  axios.post(
    `${BASE}/api/history`,
    { ...result, inputs },
    { headers: authHeaders() }
  );

export const translateText = (text) =>
  axios.get(`${BASE}/api/translate?text=${encodeURIComponent(text)}`);

export const scanStrip = (image, parameter) =>
  axios.post(
    `${BASE}/api/scan-strip`,
    { image, parameter },
    { headers: authHeaders() }
  );