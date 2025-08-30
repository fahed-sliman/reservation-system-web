
import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // ✅ الخطوة 1: استيراد Toaster

// Pages
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import HotelsPage from './pages/Hotels/Hotels';
import EventHallsPage from "./pages/EventHalls/EventHalls";
import HotelRoomsPage from './pages/Hotels/HotelsRoomsPage';
import ProfilePage from "./pages/Profile/Profile";
import MyReservationsPage from "./pages/MyReservations/MyReservationsPage";
import GenericDetailsPage from "./pages/Detils/GenericDetailsPage";
import RestaurantsPage from "./pages/Restaurants/RestaurantsPage";
import PlaygroundsPage from "./pages/PlayGround/PlayGround";
import ToursPage from "./pages/Tours/Tours";

// Components
import LoadingSpinner from "./components/Loading/LoadingSpinner";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* ✅ الخطوة 2: إضافة مكون Toaster هنا مع بعض التنسيقات الأساسية */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // النمط الافتراضي لكل التنبيهات
          style: {
            background: '#363636', // لون خلفية داكن
            color: '#fff', // لون خط أبيض
            border: '1px solid #555', // حدود رمادية
          },
          // تخصيص تنبيهات النجاح
          success: {
            duration: 4000, // مدة أطول قليلاً
            iconTheme: {
              primary: '#22c55e', // لون أيقونة أخضر
              secondary: 'white',
            },
          },
          // تخصيص تنبيهات الخطأ
          error: {
            iconTheme: {
                primary: '#ef4444', // لون أيقونة أحمر
                secondary: 'white',
            }
          }
        }}
      />
      
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

// =========================================================
// لا يوجد أي تغيير في هذا الجزء. يبقى كما هو.
// =========================================================
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, token } = useAuth();

  // LoadingSpinner يظهر فقط عند تهيئة التطبيق لأول مرة
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // مكون لحماية المسارات التي تتطلب تسجيل دخول
  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (!isAuthenticated || !token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // مكون للمسارات العامة (مثل تسجيل الدخول) التي لا يجب الوصول إليها بعد تسجيل الدخول
  const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (isAuthenticated && token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reservations"
        element={
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        }
      />

      {/* Category Pages */}
      <Route
        path="/hotels"
        element={
          <ProtectedRoute>
            <HotelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <RestaurantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventhalls"
        element={
          <ProtectedRoute>
            <EventHallsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playgrounds"
        element={
          <ProtectedRoute>
            <PlaygroundsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tours"
        element={
          <ProtectedRoute>
            <ToursPage />
          </ProtectedRoute>
        }
      />

      {/* Detail Pages */}
      <Route
        path="/hotel-rooms/:id"
        element={
          <ProtectedRoute>
            <HotelRoomsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details/:type/:id"
        element={
          <ProtectedRoute>
            <GenericDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          isAuthenticated && token ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;