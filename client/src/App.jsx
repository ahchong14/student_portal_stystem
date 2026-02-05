import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import TimetablePage from './pages/TimetablePage';
import GradesPage from './pages/GradesPage';
import FinancePage from './pages/FinancePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';

// 404 Page
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="text-6xl mb-4">🔍</div>
    <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
    <a href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
      Return to Dashboard
    </a>
  </div>
);

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/grades" element={<GradesPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
);

export default App;
