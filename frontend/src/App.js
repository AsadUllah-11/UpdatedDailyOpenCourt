import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';  // ⚡ ADD THIS
import DataTablePage from './pages/DataTablePage';
import UploadExcel from './pages/UploadExcel';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Applications */}
          <Route path="/applications" element={
            <PrivateRoute>
              <Layout>
                <Applications />
              </Layout>
            </PrivateRoute>
          } />

          {/* ⚡ Application Detail - ADD THIS */}
          <Route path="/applications/:id" element={
            <PrivateRoute>
              <Layout>
                <ApplicationDetail />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Data Table */}
          <Route path="/data-table" element={
            <PrivateRoute>
              <Layout>
                <DataTablePage />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Upload Excel */}
          <Route path="/upload" element={
            <PrivateRoute>
              <Layout>
                <UploadExcel />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Analytics */}
          <Route path="/analytics" element={
            <PrivateRoute>
              <Layout>
                <Analytics />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;