import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const profileRes = await api.get('/students/profile');
        setProfile(profileRes.data);

        const notificationsRes = await api.get('/notifications');
        setRecentNotifications(notificationsRes.data.slice(0, 3));

        const gradesRes = await api.get('/grades');
        
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data.filter(c => c.enrolled).slice(0, 3));

        // Determine academic standing
        let standing = 'Good';
        if (gradesRes.data.gpa < 2.0) standing = 'At Risk';
        else if (gradesRes.data.gpa < 3.0) standing = 'Needs Improvement';

        setStats({
          gpa: gradesRes.data.gpa,
          enrolledCourses: profileRes.data.enrolledCourses,
          balance: profileRes.data.pendingBalance,
          unreadNotifications: notificationsRes.data.filter((n) => !n.read).length,
          academicStanding: standing,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ icon, label, value, color, subtext }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white text-opacity-80 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-white text-opacity-70 text-xs mt-1">{subtext}</p>}
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
      </div>
    </div>
  );

  const WarningCard = ({ title, message, actions }) => (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 shadow">
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">⚠️</span>
        <div className="flex-1">
          <h3 className="font-bold text-amber-900 mb-1">{title}</h3>
          <p className="text-amber-800 text-sm">{message}</p>
          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {profile && stats && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.fullName || 'Student'}! 👋</h1>
              <p className="text-blue-100">
                {profile?.program} • Year {profile?.year} • ID: {profile?.studentId}
              </p>
            </div>
            <img
              src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg hidden sm:block"
            />
          </div>
        </div>
      )}

      {/* Key Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="📊"
            label="GPA"
            value={stats.gpa.toFixed(2)}
            color="from-emerald-500 to-emerald-600"
            subtext={`Standing: ${stats.academicStanding}`}
          />
          <StatCard
            icon="📚"
            label="Enrolled Courses"
            value={stats.enrolledCourses}
            color="from-blue-500 to-blue-600"
            subtext={`This semester`}
          />
          <StatCard
            icon="💰"
            label="Balance Due"
            value={`$${stats.balance.toFixed(2)}`}
            color={stats.balance > 1000 ? 'from-red-500 to-red-600' : 'from-amber-500 to-amber-600'}
            subtext={stats.balance > 0 ? 'Action needed' : 'All paid'}
          />
          <StatCard
            icon="🔔"
            label="Notifications"
            value={stats.unreadNotifications}
            color="from-purple-500 to-purple-600"
            subtext={`Unread messages`}
          />
        </div>
      )}

      {/* Warnings & Alerts */}
      <div className="space-y-4">
        {stats && stats.balance > 1000 && (
          <WarningCard
            title="Outstanding Balance"
            message={`You have a pending balance of $${stats.balance.toFixed(2)}. Settling this will help maintain good academic standing.`}
            actions={<Link to="/finance" className="text-amber-700 hover:text-amber-900 font-semibold text-sm">Pay Now →</Link>}
          />
        )}
        
        {stats && stats.academicStanding !== 'Good' && (
          <WarningCard
            title="Academic Performance Alert"
            message={`Your GPA is ${stats.gpa.toFixed(2)}. Consider visiting your academic advisor or improving focus on course work.`}
            actions={<Link to="/grades" className="text-amber-700 hover:text-amber-900 font-semibold text-sm">View Grades →</Link>}
          />
        )}

        {stats && stats.unreadNotifications > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 shadow">
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">ℹ️</span>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">New Messages</h3>
                <p className="text-blue-800 text-sm">You have {stats.unreadNotifications} unread notification{stats.unreadNotifications > 1 ? 's' : ''}. Check them out!</p>
                <Link to="/notifications" className="text-blue-700 hover:text-blue-900 font-semibold text-sm mt-2 inline-block">View All →</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Courses Section */}
      {courses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📚 Your Courses This Semester</h2>
            <Link to="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">{course.code}</p>
                    <p className="font-bold text-gray-800 text-sm mt-1 line-clamp-2">{course.title}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>👨‍🏫 {course.instructor}</p>
                  <p>🕐 {course.timeslot}</p>
                  <p>📍 {course.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { path: '/courses', icon: '📚', label: 'Courses', desc: 'Browse & enroll' },
            { path: '/grades', icon: '📈', label: 'Grades', desc: 'View scores' },
            { path: '/finance', icon: '💰', label: 'Finance', desc: 'Pay tuition' },
            { path: '/timetable', icon: '🕐', label: 'Timetable', desc: 'View schedule' },
            { path: '/documents', icon: '📄', label: 'Documents', desc: 'Request docs' },
            { path: '/profile', icon: '👤', label: 'Profile', desc: 'My info' },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{action.label}</p>
              <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🔔 Recent Notifications</h2>
            <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className={`rounded-lg border p-4 hover:shadow-md transition-all ${
                !notif.read ? 'bg-blue-50 border-blue-300 shadow' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">
                    {notif.type === 'academic' ? '📚' : notif.type === 'financial' ? '💰' : '📢'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{notif.title}</p>
                      {!notif.read && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">NEW</span>}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Support Resources */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-bold text-indigo-900 mb-4">📖 Academic Support & Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="font-semibold text-indigo-900 mb-1">💬 Academic Advisor</p>
            <p className="text-sm text-gray-700 mb-2">Schedule a meeting with your advisor</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">Contact Now →</a>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="font-semibold text-indigo-900 mb-1">📚 Study Groups</p>
            <p className="text-sm text-gray-700 mb-2">Join a study group for your courses</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">Find Groups →</a>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="font-semibold text-indigo-900 mb-1">🎓 Tutoring Center</p>
            <p className="text-sm text-gray-700 mb-2">Get one-on-one tutoring help</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">Learn More →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
