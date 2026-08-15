import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  // 1. Nếu đang trong quá trình khôi phục token từ localStorage, hiển thị chữ Loading

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading session...</div>
    );
  }

  // 2. Nếu chưa có user (chưa đăng nhập), đá về trang Login

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Nếu route yêu cầu Admin mà role không phải Admin, đá về dashboard user

  if (adminOnly && user.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Hợp lệ, cho vào trang con

  return <Outlet />;
};

export default ProtectedRoute;
