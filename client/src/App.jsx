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

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
    </Routes>
  </Layout>
);

export default App;
