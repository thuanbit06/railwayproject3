import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { UserProvider } from "./context/UserContext"; // 👈 1. Import UserProvider

import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User
import Introduction from "./pages/user/Introduction";
import UserDashboard from "./pages/user/UserDashboard";
import SearchTrain from "./pages/user/SearchTrain";
import TrainResults from "./pages/user/TrainResults";
import TrainDetails from "./pages/user/TrainDetails";
import BookTicket from "./pages/user/BookTicket";
import Payment from "./pages/user/Payment";
import BookingSuccess from "./pages/user/BookingSuccess";
import MyTickets from "./pages/user/MyTickets";
import TicketDetails from "./pages/user/TicketDetails";
import CancelTicket from "./pages/user/CancelTicket";
import Settings from "./pages/user/Settings";
import TrainScheduleDetail from "./pages/user/TrainScheduleDetail";
import PnrStatus from "./pages/user/PnrStatus";
import Support from "./pages/user/Support";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import Analytics from "./pages/admin/Analytics";
import TrainManagement from "./pages/admin/TrainManagement";
import StationManagement from "./pages/admin/StationManagement";
import ReservationsManagement from "./pages/admin/ReservationsManagement";
import TicketsManagement from "./pages/admin/TicketsManagement";
import Help from "./pages/admin/Help";
import Seats from "./pages/admin/Seats";
import CoachManagement from "./pages/admin/CoachManagement";

function App() {
  return (
    // 👇 2. Bọc UserProvider ở ngoài cùng (hoặc trong AuthProvider đều ok)
    <UserProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Introduction />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/search" element={<SearchTrain />} />
                <Route path="/trains" element={<TrainResults />} />
                <Route path="/trains/:id" element={<TrainDetails />} />
                <Route path="/book-ticket" element={<BookTicket />} />
                <Route
                  path="/schedule/:scheduleId?"
                  element={<TrainScheduleDetail />}
                />
                <Route path="support" element={<Support />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<BookingSuccess />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/pnr" element={<PnrStatus />} />
                <Route path="/ticket/:pnr" element={<TicketDetails />} />
                <Route path="/cancel/:pnr" element={<CancelTicket />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<Navigate to="dashboard" replace />} />

                  <Route path="dashboard" element={<DashboardHome />} />

                  <Route path="trains" element={<TrainManagement />} />

                  <Route path="stations" element={<StationManagement />} />

                  <Route
                    path="reservations"
                    element={<ReservationsManagement />}
                  />

                  <Route path="tickets" element={<TicketsManagement />} />

                  <Route path="analytics" element={<Analytics />} />
                  <Route path="seat" element={<Seats />} />
                  <Route
                    path="/admin/trains/:trainId/coaches"
                    element={<CoachManagement />}
                  />

                  <Route
                    path="/admin/coaches/:coachId/seats"
                    element={<Seats />}
                  />

                  <Route path="settings" element={<Settings />} />

                  <Route path="help" element={<Help />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </UserProvider> // 👈 3. Đóng UserProvider
  );
}

export default App;
