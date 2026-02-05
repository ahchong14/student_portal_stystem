import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/students/profile');
        setProfile(response.data || {});
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async () => {
    try {
      const response = await api.put('/students/profile', profile);
      setProfile(response.data);
      setEditing(false);
      setSaveSuccess('Profile updated successfully! ✓');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const InputField = ({ label, field, type = 'text', readOnly = false }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {editing && !readOnly ? (
        <input
          type={type}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          value={profile[field] || ''}
          onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
        />
      ) : (
        <p className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">{profile[field] || 'N/A'}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">🔄 Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Profile 👤</h1>
            <p className="text-cyan-100">View and manage your personal information</p>
          </div>
          <img
            src={profile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg hidden sm:block"
          />
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">{saveSuccess}</p>
          <button onClick={() => setSaveSuccess('')} className="text-xl hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📋 Personal Information</h2>
          <button
            onClick={() => (editing ? updateProfile() : setEditing(true))}
            className="px-6 py-2 rounded-lg font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700"
          >
            {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" field="fullName" />
          <InputField label="Email Address" field="email" type="email" readOnly={true} />
          <InputField label="Student ID" field="studentId" readOnly={true} />
          <InputField label="Program" field="program" />
          <InputField label="Year of Study" field="year" type="number" />
          <InputField label="Contact Number" field="contactNumber" type="tel" />
        </div>

        {editing && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={updateProfile}
              className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              ✓ Save All Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🚨 Emergency Contact Information</h2>
        <p className="text-gray-600 text-sm mb-4">This information is used only in emergency situations to contact someone other than yourself.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Emergency Contact Name" field="emergencyContactName" />
          <InputField label="Emergency Contact Phone" field="emergencyContactPhone" type="tel" />
        </div>

        {editing && (
          <p className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
            👉 Make sure this is someone you trust who can make decisions on your behalf in an emergency.
          </p>
        )}
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Academic Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Current GPA</p>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {profile.gpa ? profile.gpa.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <p className="text-gray-600">Enrolled Courses</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {profile.enrolledCourses || 0}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <p className="text-gray-600">Standing</p>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                ✓ Good
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔐 Account Security</h3>
          <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-3">
            🔐 Change Password
          </button>
          <button className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors mb-3">
            📱 Enable Two-Factor Auth
          </button>
          <button className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors">
            🖥️ Manage Login Sessions
          </button>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="font-bold text-emerald-900 mb-4">✅ Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Account Status</p>
            <p className="font-bold text-emerald-600">🟢 Active</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Email Verified</p>
            <p className="font-bold text-emerald-600">✓ Verified</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Two-Factor Auth</p>
            <p className="font-bold text-gray-600">Not Enabled</p>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">💬 Need Help?</h3>
        <p className="text-blue-800 text-sm mb-3">If you need to update your information or have questions about your profile, contact your academic advisor.</p>
        <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-sm">Contact Academic Advisor →</a>
      </div>
    </div>
  );
};

export default ProfilePage;
