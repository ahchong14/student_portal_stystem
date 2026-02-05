import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const AdminPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const response = await api.get('/admin/students', { params: { q: query } });
      setStudents(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Administration ⚙️</h1>
        <p className="text-indigo-100">Manage students, monitor system health, and generate reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">Total Students</p>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">Active Sessions</p>
          <p className="text-3xl font-bold text-blue-600">89</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">System Health</p>
          <p className="text-3xl font-bold text-emerald-600">98%</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">Data Backup</p>
          <p className="text-3xl font-bold text-purple-600">✓ OK</p>
        </div>
      </div>

      {/* Student Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Students</h2>
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            placeholder="Search by name, email, or student ID..."
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? '🔄 Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <p className="text-gray-500 text-center py-8">🔄 Searching...</p>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-300 bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Student ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-gray-800">{student.id}</td>
                        <td className="px-4 py-4 text-gray-700">{student.StudentProfile?.fullName || 'N/A'}</td>
                        <td className="px-4 py-4 text-gray-700">{student.email}</td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            ✓ Active
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm mr-3">
                            👁️ View
                          </button>
                          <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No students found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">Generate Report</p>
            <p className="text-xs text-gray-500 mt-2">Export student data</p>
          </button>
          <button className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🔐</div>
            <p className="font-semibold text-gray-800">System Settings</p>
            <p className="text-xs text-gray-500 mt-2">Manage system config</p>
          </button>
          <button className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">📋</div>
            <p className="font-semibold text-gray-800">Audit Logs</p>
            <p className="text-xs text-gray-500 mt-2">View system activity</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
