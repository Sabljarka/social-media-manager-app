import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FacebookPage from './pages/FacebookPage';
import InstagramPage from './pages/InstagramPage';
import Settings from './pages/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeContextProvider } from './context/ThemeContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="facebook" element={<FacebookPage />} />
            <Route path="instagram" element={<InstagramPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
