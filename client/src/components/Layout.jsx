import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState('Student');
  const [userEmail, setUserEmail] = useState('user@university.edu');
  const [userName, setUserName] = useState('User');

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
      navigate('/login', { replace: true });
    }
    
    // Load user info from localStorage (in real app, would be from API)
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'Student');
        setUserEmail(userData.email || 'user@university.edu');
        setUserName(userData.fullName || 'User');
      } catch (e) {
        // Default values if parsing fails
      }
    }
  }, [location.pathname, navigate]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { path: '/dashboard', label: t('dashboard'), icon: '📊' },
      { path: '/notifications', label: t('notifications'), icon: '🔔' },
    ];

    const studentItems = [
      { path: '/courses', label: t('courses'), icon: '📚' },
      { path: '/timetable', label: t('timetable'), icon: '🕐' },
      { path: '/grades', label: t('grades'), icon: '📈' },
      { path: '/finance', label: t('finance'), icon: '💰' },
      { path: '/documents', label: t('documents'), icon: '📄' },
    ];

    const staffItems = [
      { path: '/courses', label: t('courses'), icon: '📚' },
      { path: '/grades', label: t('grades'), icon: '📈' },
    ];

    const adminItems = [
      { path: '/admin', label: 'Administration', icon: '⚙️' },
    ];

    let roleItems = [];
    if (userRole === 'Student') {
      roleItems = studentItems;
    } else if (['Lecturer', 'Registrar', 'Finance'].includes(userRole)) {
      roleItems = staffItems;
    }
    if (['SystemAdmin', 'Registrar'].includes(userRole)) {
      roleItems = [...roleItems, ...adminItems];
    }

    return [...commonItems, ...roleItems, { path: '/profile', label: t('profile'), icon: '👤' }];
  };

  const navItems = getNavItems();

  // Get breadcrumb trail
  const getBreadcrumbs = () => {
    const pathName = location.pathname;
    if (pathName === '/login' || pathName === '/register' || pathName === '/') {
      return [];
    }

    const routes = {
      '/dashboard': 'Dashboard',
      '/courses': 'Courses',
      '/timetable': 'Timetable',
      '/grades': 'Grades',
      '/finance': 'Finance',
      '/notifications': 'Notifications',
      '/admin': 'Administration',
      '/profile': 'Profile',
      '/documents': 'Documents',
    };

    return [
      { label: 'Home', path: '/dashboard' },
      { label: routes[pathName] || 'Page', path: pathName },
    ];
  };

  const pageTitle = {
    '/dashboard': '👋 Dashboard',
    '/courses': '📚 Courses',
    '/timetable': '🕐 Timetable',
    '/grades': '📈 Grades',
    '/finance': '💰 Finance',
    '/notifications': '🔔 Notifications',
    '/admin': '⚙️ Administration',
    '/profile': '👤 Profile',
    '/documents': '📄 Documents',
  };

  // Hide layout on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <h1 className="text-xl font-bold">UniPortal</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="px-4 py-2 text-xs border-t border-blue-700">
            <div className="text-blue-300">Role</div>
            <div className="font-semibold text-white">{userRole}</div>
          </div>
        )}

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-blue-500 shadow-lg'
                    : 'hover:bg-blue-700 hover:shadow'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className={`transition-transform group-hover:translate-x-1 ${
                    isActive ? 'font-bold' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {pageTitle[location.pathname] || 'Student Portal'}
              </h2>
              <p className="text-sm text-gray-500">
                {userRole === 'Student' ? 'Manage your academic life' : `Role: ${userRole}`}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                    i18n.language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('zh')}
                  className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                    i18n.language === 'zh' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="中文"
                >
                  中文
                </button>
              </div>

              {/* Notifications */}
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications">
                🔔
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={userName}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{userName}</span>
                  <span className="text-gray-400">▼</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">{userEmail}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 Profile Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-b-lg transition-colors border-t border-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          {getBreadcrumbs().length > 0 && (
            <div className="px-8 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-sm">
              {getBreadcrumbs().map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <Link to={crumb.path} className="text-blue-600 hover:text-blue-700 hover:underline">
                    {crumb.label}
                  </Link>
                  {idx < getBreadcrumbs().length - 1 && <span className="text-gray-400">/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
