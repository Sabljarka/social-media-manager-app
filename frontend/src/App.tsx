import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FacebookPage from './pages/FacebookPage';
import InstagramPage from './pages/InstagramPage';
import Settings from './pages/Settings';
import { ThemeContextProvider } from './context/ThemeContext';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DataDeletion from './pages/DataDeletion';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Box minH="100vh">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/data-deletion" element={<DataDeletion />} />

            {/* Main routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="facebook" element={<FacebookPage />} />
              <Route path="instagram" element={<InstagramPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </Box>
    </ThemeContextProvider>
  );
};

export default App;
