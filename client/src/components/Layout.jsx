import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="min-h-screen text-gray-900">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/dashboard" className="text-xl font-semibold">
            {t('appName')}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/courses" className="hover:text-blue-600">{t('courses')}</Link>
            <Link to="/timetable" className="hover:text-blue-600">{t('timetable')}</Link>
            <Link to="/grades" className="hover:text-blue-600">{t('grades')}</Link>
            <Link to="/finance" className="hover:text-blue-600">{t('finance')}</Link>
            <Link to="/notifications" className="hover:text-blue-600">{t('notifications')}</Link>
            <Link to="/documents" className="hover:text-blue-600">{t('documents')}</Link>
            <Link to="/admin" className="hover:text-blue-600">{t('admin')}</Link>
            <Link to="/profile" className="hover:text-blue-600">{t('profile')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <label className="text-sm" htmlFor="language">{t('language')}</label>
            <select id="language" onChange={changeLanguage} className="border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded bg-blue-600 px-3 py-1 text-white"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
};

export default Layout;
