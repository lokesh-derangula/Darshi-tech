import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBanner from './components/TopBanner';
import ProtectedRoute from './components/ProtectedRoute';
import { Trefoil } from 'ldrs/react';
import 'ldrs/react/Trefoil.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Import Pages
import Home from './pages/Home';
import ProductDevelopment from './pages/ProductDevelopment';
import WebAppDevelopment from './pages/WebAppDevelopment';
import ResearchInternships from './pages/ResearchInternships';
import FullStackInternships from './pages/FullStackInternships';
import TrainingPlacements from './pages/TrainingPlacements';
import JeeEapcetTraining from './pages/JeeEapcetTraining';
import WorkshopsConferences from './pages/WorkshopsConferences';
import ContactUs from './pages/ContactUs';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import VerifyCertificate from './pages/VerifyCertificate';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('darshi_theme') || 'dark';
  });

  useEffect(() => {
    // Restore user from localStorage
    const savedUser = localStorage.getItem('darshi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'bright') {
      document.documentElement.classList.add('bright-theme');
    } else {
      document.documentElement.classList.remove('bright-theme');
    }
    localStorage.setItem('darshi_theme', theme);
  }, [theme]);

  const handleLogin = (userData, token) => {
    localStorage.setItem('darshi_token', token);
    localStorage.setItem('darshi_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('darshi_token');
    localStorage.removeItem('darshi_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-mesh">
        <Trefoil
          size="40"
          stroke="4"
          strokeLength="0.15"
          bgOpacity="0.1"
          speed="1.4"
          color={theme === 'bright' ? '#1e2e30' : '#c5a880'} 
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-mesh text-theme-body relative overflow-hidden transition-colors duration-300">

        {/* ── Fixed Company Banner ── */}
        <TopBanner theme={theme} setTheme={setTheme} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} user={user} />

        {/* Floating background blobs — pushed down by banner, hidden in bright mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-[90px] left-10 w-72 h-72 rounded-full bg-[#c5a880]/3 blur-3xl pointer-events-none animate-float-slow z-0"></div>
            <div className="absolute top-1/3 right-20 w-96 h-96 rounded-full bg-[#1c202d]/25 blur-3xl pointer-events-none animate-float-reverse z-0"></div>
            <div className="absolute bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-[#c5a880]/2 blur-3xl pointer-events-none animate-float-slow z-0"></div>
          </>
        )}

        {/* Left Sidebar — starts below the banner */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          onLogout={handleLogout}
          bannerHeight={80}
          theme={theme}
        />

        {/* Mobile Backdrop Overlay for Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            style={{ top: '80px' }}
          />
        )}

        {/* Main Content Area — padded top to clear the banner */}
        <main
          className={`transition-all duration-300 min-h-screen flex flex-col justify-between pt-[80px] ${
            isSidebarOpen ? 'pl-0 md:pl-72' : 'pl-0 md:pl-20'
          }`}
        >
          {/* Scrollable page body */}
          <div className="flex-grow p-6 md:p-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product-development" element={<ProductDevelopment />} />
              <Route path="/web-app-development" element={<WebAppDevelopment />} />
              <Route path="/research-projects" element={<ResearchInternships />} />
              <Route path="/full-stack-projects" element={<FullStackInternships />} />
              <Route path="/training-placements" element={<TrainingPlacements />} />
              <Route path="/jee-eapcet-training" element={<JeeEapcetTraining />} />
              <Route path="/workshops-conferences" element={<WorkshopsConferences />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />

              {/* Authentication Routes */}
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Student Dashboard */}
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute user={user} requiredRole="STUDENT">
                    <StudentDashboard user={user} />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute user={user} requiredRole="ADMIN">
                    <AdminDashboard user={user} />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Site Footer */}
          <footer className="border-t border-theme-divider bg-theme-card/45 py-6 text-center text-xs text-theme-muted transition-colors duration-300">
            &copy; {new Date().getFullYear()} DARSHI TECH. All rights reserved. Built with high-security guidelines.
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}
