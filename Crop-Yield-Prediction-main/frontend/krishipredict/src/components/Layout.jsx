import { Outlet, useLocation } from "react-router-dom";
import Chatbot from "./Chatbot";

export default function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage  = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Outlet />
      {!isAdminPage && !isAuthPage && <Chatbot />}
    </>
  );
}
