// // import api from "./api"; // Giữ nguyên để sau này bật lại backend chỉ cần đổi 1 dòng

// /**
//  * Lấy dữ liệu tổng quan cho Dashboard
//  * Hiện tại: Dùng MOCK DATA (không gọi backend)
//  * Sau này: Bỏ comment đoạn api.get và xóa return mockData
//  * @returns {Promise<Object>}
//  */
// export const getDashboardStatistics = async () => {
//   // ========== MOCK DATA ==========
//   const mockData = {
//     todayBookings: 12,
//     totalRevenue: 18500000,
//     newCustomers: 3,
//     waitingBookings: 2,
//     revenueChart: [
//       { date: "19/08", amount: 2200000 },
//       { date: "20/08", amount: 3100000 },
//       { date: "21/08", amount: 1800000 },
//       { date: "22/08", amount: 4500000 },
//       { date: "23/08", amount: 0 },
//       { date: "24/08", amount: 3900000 },
//       { date: "25/08", amount: 3000000 },
//     ],
//   };

//   // Giả lập delay mạng 300ms cho giống thật
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(mockData), 300);
//   });

//   // ========== KHI CÓ BACKEND THẬT, BỎ COMMENT DƯỚI NÀY ==========
//   // try {
//   //   const response = await api.get("/admin/stats");
//   //   return response.data;
//   // } catch (error) {
//   //   console.error("Failed to fetch dashboard stats:", error);
//   //   throw error;
//   // }
// };

// /**
//  * Lấy thông tin User hiện tại
//  * Hiện tại: Dùng MOCK DATA
//  * @returns {Promise<Object>}
//  */
// export const getCurrentUser = async () => {
//   const mockUser = {
//     userId: 1,
//     username: "admin",
//     email: "admin@raillink.vn",
//     userType: "Admin", // "Admin" | "User"
//     name: "Administrator",
//     createdAt: "2025-08-01T10:00:00Z",
//   };

//   return new Promise((resolve) => {
//     setTimeout(() => resolve(mockUser), 200);
//   });

//   // ========== KHI CÓ BACKEND THẬT ==========
//   // try {
//   //   const response = await api.get("/auth/me");
//   //   return response.data;
//   // } catch (error) {
//   //   console.error("Failed to fetch current user:", error);
//   //   throw error;
//   // }
// };

// src/services/statsService.js

/**
 * Lấy dữ liệu tổng quan cho Dashboard
 * MOCK DATA MODE — không gọi backend
 */
export const getDashboardStats = async () => {
  const mockData = {
    // ── Stats Cards (4 cái thẻ xanh trên cùng) ──────────────
    stats: [
      {
        label: "Today's Bookings",
        value: 12,
        change: "+3 from yesterday",
        trend: "up",
        icon: "Ticket",
        bg: "bg-blue-100",
        color: "text-blue-600",
      },
      {
        label: "Total Revenue",
        value: "₫18,500,000",
        change: "+12% this week",
        trend: "up",
        icon: "TrendingUp",
        bg: "bg-green-100",
        color: "text-green-600",
      },
      {
        label: "New Customers",
        value: 3,
        change: "+1 from yesterday",
        trend: "up",
        icon: "Users",
        bg: "bg-purple-100",
        color: "text-purple-600",
      },
      {
        label: "Waiting Bookings",
        value: 2,
        change: "-1 from yesterday",
        trend: "down",
        icon: "Train",
        bg: "bg-orange-100",
        color: "text-orange-600",
      },
    ],

    // ── Revenue Chart (7 ngày) ──────────────────────────────
    revenue: [
      { d: "19/08", r: 2200000 },
      { d: "20/08", r: 3100000 },
      { d: "21/08", r: 1800000 },
      { d: "22/08", r: 4500000 },
      { d: "23/08", r: 0 },
      { d: "24/08", r: 3900000 },
      { d: "25/08", r: 3000000 },
    ],

    // ── Pie Chart (Trạng thái vé) ───────────────────────────
    distribution: [
      { name: "Confirmed", value: 65, color: "#22c55e" },
      { name: "Waiting", value: 20, color: "#f59e0b" },
      { name: "Cancelled", value: 15, color: "#ef4444" },
    ],

    // ── Recent Activities ──────────────────────────────────
    activities: [
      {
        id: 1,
        title: "New Booking",
        detail: "PNR #BK001 — Hanoi → Da Nang (SE1)",
        time: "2 mins ago",
        icon: "Ticket",
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: 2,
        title: "Payment Received",
        detail: "₫1,250,000 from Nguyen Van A",
        time: "15 mins ago",
        icon: "TrendingUp",
        color: "bg-green-100 text-green-600",
      },
      {
        id: 3,
        title: "Ticket Cancelled",
        detail: "PNR #BK045 — Refund ₫300,000",
        time: "1 hour ago",
        icon: "XCircle",
        color: "bg-red-100 text-red-600",
      },
      {
        id: 4,
        title: "New User Registered",
        detail: "tran.thi.b@gmail.com",
        time: "3 hours ago",
        icon: "Users",
        color: "bg-purple-100 text-purple-600",
      },
    ],
  };

  // Giả lập delay mạng
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 300);
  });
};

/**
 * Lấy thông tin User hiện tại — MOCK
 */
export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          userId: 1,
          username: "admin",
          email: "admin@raillink.vn",
          userType: "Admin",
          name: "Administrator",
          createdAt: "2025-08-01T10:00:00Z",
        }),
      200,
    );
  });
};
