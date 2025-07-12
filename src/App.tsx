// src/App.tsx

import React, { useState, useEffect, type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅  الخطوة 1: استيراد مكون الهيدر

// استيراد الصفحات
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import HotelsPage from './pages/Hotels/Hotels';
import RestaurantsPage from "./pages/Restaurants/RestaurantsPage";
import EventHallsPage from "./pages/EventHalls/EventHalls";
import PlaygroundsPage from "./pages/PlayGround/PlayGround";
import ToursPage from "./pages/Tours/Tours";
import HotelRoomsPage from './pages/Hotels/HotelsRoomsPage';
import ProfilePage from "./pages/Profile/Profile";
import MyReservationsPage from "./pages/MyReservations/MyReservationsPage";
import GenericDetailsPage from "./pages/Detils/GenericDetailsPage";
import Header from "./components/Header/header";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token"));
  });

  useEffect(() => {
    const onStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    // إذا كان المستخدم مسجلاً، أظهر الهيدر والصفحة المطلوبة
    return isAuthenticated ? (
      <>
        <Header />
        {children}
      </>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <BrowserRouter>
      {/* 
        ✅ الخطوة 2: تم نقل الهيدر إلى داخل مكونات المسار المحمي 
           أو يمكن وضعه هنا مباشرة إذا أردت إظهاره في كل الصفحات حتى صفحات تسجيل الدخول (لكن هذا ليس مطلوباً في حالتك).
      */}
      <Routes>
        {/* --- مسارات عامة (بدون هيدر) --- */}
        <Route path="/login" element={ isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} /> } />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />} />

        {/* --- مسارات محمية (مع الهيدر) --- */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage onLogout={logout} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />

        {/* -- مسارات صفحات الفئات الرئيسية -- */}
        <Route path="/hotels" element={<ProtectedRoute><HotelsPage /></ProtectedRoute>} />
        <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
        <Route path="/eventhalls" element={<ProtectedRoute><EventHallsPage /></ProtectedRoute>} />
        <Route path="/playgrounds" element={<ProtectedRoute><PlaygroundsPage /></ProtectedRoute>} />
        <Route path="/tours" element={<ProtectedRoute><ToursPage /></ProtectedRoute>} />

        {/* --- مسارات صفحات التفاصيل --- */}
        <Route path="/hotel-rooms/:id" element={<ProtectedRoute><HotelRoomsPage /></ProtectedRoute>} />
        <Route path="/details/:type/:id" element={<ProtectedRoute><GenericDetailsPage /></ProtectedRoute>} />

        {/* --- مسار احتياطي --- */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;