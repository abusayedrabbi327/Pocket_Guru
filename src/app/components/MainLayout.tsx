import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";
import { useAppContext } from "../context/AppContext";

// Routes that belong to the user flow
const userRoutes = [
  "/home",
  "/transactions",
  "/add-transaction",
  "/activity",
  "/add-goal",
  "/budget",
  "/analytics",
  "/profile",
  "/consultants",
  "/consultant/",
  "/chat/",
  "/subscription",
  "/admin",
];

// Routes that belong to the consultant flow
const consultantRoutes = [
  "/consultant-dashboard",
  "/consultant-clients",
  "/consultant-messages",
  "/consultant-schedule",
  "/consultant-profile",
  "/consultant-setup",
];

function isConsultantRoute(pathname: string): boolean {
  return consultantRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function isUserRoute(pathname: string): boolean {
  return userRoutes.some(
    (r) => pathname === r || pathname.startsWith(r)
  );
}

export function MainLayout() {
  const { user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;

    // If consultant is trying to access user routes, redirect to consultant dashboard
    if (user.role === "consultant" && isUserRoute(path) && !isConsultantRoute(path)) {
      navigate("/consultant-dashboard", { replace: true });
      return;
    }

    // If user is trying to access consultant routes, redirect to home
    if (user.role === "user" && isConsultantRoute(path)) {
      navigate("/home", { replace: true });
      return;
    }

    // Admin can access user routes (admin views user side + admin panel)
    // No redirect needed for admin
  }, [location.pathname, user.role, navigate]);

  return (
    <div className="h-full relative">
      <Outlet />
      <BottomNav />
    </div>
  );
}
