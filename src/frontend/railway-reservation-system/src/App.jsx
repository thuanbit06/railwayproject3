import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { TrainProvider } from "./context/TrainContext";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import SearchTrainPage from "./pages/SearchTrainPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import BookingPage from "./pages/BookingPage";
import QueryPage from "./pages/QueryPage";
import CancellationPage from "./pages/CancellationPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminDashboard from "./features/admin/AdminDashboard";
import { RequireAuth } from "./features/auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TrainProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              }
            />

            <Route
              path="/search"
              element={
                <RequireAuth>
                  <MainLayout>
                    <SearchTrainPage />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/results"
              element={
                <RequireAuth>
                  <MainLayout>
                    <SearchResultsPage />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/booking"
              element={
                <RequireAuth>
                  <MainLayout>
                    <BookingPage />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/query"
              element={
                <RequireAuth>
                  <MainLayout>
                    <QueryPage />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/cancel"
              element={
                <RequireAuth>
                  <MainLayout>
                    <CancellationPage />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/change-password"
              element={
                <RequireAuth>
                  <MainLayout>
                    <ChangePasswordPage />
                  </MainLayout>
                </RequireAuth>
              }
            />

            <Route
              path="/admin/*"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />

            <Route path="/" element={<Navigate to="/search" />} />
          </Routes>
        </TrainProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
