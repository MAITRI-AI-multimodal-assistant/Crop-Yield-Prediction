import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import FeedbackPage from "./pages/FeedbackPage";
import ContactPage from "./pages/ContactPage";

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
      { path: "/feedback",      element: <FeedbackPage /> },
      { path: "/contact",       element: <ContactPage /> },
      { path: "/admin",         element: <AdminDashboard /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
