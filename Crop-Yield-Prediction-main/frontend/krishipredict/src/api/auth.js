import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";

// Hardcoded admin email - anyone registering with this becomes admin
export const ADMIN_EMAIL = "admin@krishipredict.com";

/* ─── Token helpers ──────────────────────────────────────────────── */
export const getToken   = () => localStorage.getItem("kp_token");
export const getUser    = () => JSON.parse(localStorage.getItem("kp_user") || "null");
export const isLoggedIn = () => !!getToken();
export const isAdmin    = () => getUser()?.role === "admin";
export const isFarmer   = () => getUser()?.role === "farmer";
export const isSeller   = () => getUser()?.role === "seller";

export const saveSession = (token, user) => {
  localStorage.setItem("kp_token", token);
  localStorage.setItem("kp_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("kp_token");
  localStorage.removeItem("kp_user");
};

// Alias used by Header and AdminDashboard
export const logoutUser = clearSession;

/* ─── Mock auth ──────────────────────────────────────────────────── */
const MOCK_USERS_KEY = "kp_mock_users";
const getMockUsers   = () => JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
const saveMockUsers  = (u) => localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(u));
const makeMockToken  = (user) =>
  btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 }));

export const mockRegister = ({ name, email, password, phone, role, address }) => {
  const users = getMockUsers();
  if (users.find(u => u.email === email))
    throw new Error("An account with this email already exists.");
  // Override role to admin if email matches
  const finalRole = email === ADMIN_EMAIL ? "admin" : (role || "farmer");
  const user = {
    id: `usr_${Date.now()}`,
    name, email, phone: phone || "", role: finalRole, address: address || "",
    createdAt: new Date().toISOString(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
  };
  saveMockUsers([...users, { ...user, password }]);
  const token = makeMockToken(user);
  saveSession(token, user);
  return { token, user };
};

export const mockLogin = ({ email, password }) => {
  const users = getMockUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) throw new Error("Incorrect email or password.");
  const { password: _pw, ...user } = found;
  const token = makeMockToken(user);
  saveSession(token, user);
  return { token, user };
};

/* ─── Standard register (backend → mock fallback) ────────────────── */
export const registerUser = async (formData) => {
  const finalRole = formData.email === ADMIN_EMAIL ? "admin" : formData.role;
  const payload   = { ...formData, role: finalRole };
  try {
    const { data } = await axios.post(`${BASE}/api/auth/register`, payload);
    saveSession(data.token, data.user);
    return data.user;
  } catch (err) {
    if (!err.response) return mockRegister(payload);
    throw new Error(err.response?.data?.message || "Registration failed.");
  }
};

/* ─── Standard login (backend → mock fallback) ───────────────────── */
export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${BASE}/api/auth/login`, { email, password });
    saveSession(data.token, data.user);
    return data.user;
  } catch (err) {
    if (!err.response) return mockLogin({ email, password });
    throw new Error(err.response?.data?.message || "Login failed. Check credentials.");
  }
};
