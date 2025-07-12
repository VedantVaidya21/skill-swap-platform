import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import SkillsManagement from './pages/skills/SkillsManagement';
import UserSearch from './pages/search/UserSearch';
import SwapRequests from './pages/swaps/SwapRequests';
import FeedbackForm from './pages/feedback/FeedbackForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/skills" element={
              <PrivateRoute>
                <SkillsManagement />
              </PrivateRoute>
            } />
            <Route path="/search" element={
              <PrivateRoute>
                <UserSearch />
              </PrivateRoute>
            } />
            <Route path="/swap-requests" element={
              <PrivateRoute>
                <SwapRequests />
              </PrivateRoute>
            } />
            <Route path="/feedback/:swapId" element={
              <PrivateRoute>
                <FeedbackForm />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 