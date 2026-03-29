import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/",              element: <Home /> },
      { path: "/login",         element: <LoginPage /> },
      { path: "/register",      element: <RegisterPage /> },
      { path: "/predict",       element: <InputPage /> },
      { path: "/result",        element: <ResultPage /> },
      { path: "/marketplace",   element: <MarketplacePage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/admin",         element: <AdminDashboard /> },
    ],
  },
]);

export default function App() {
  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb", currency: "USD" }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  );
}