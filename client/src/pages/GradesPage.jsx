import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const GradesPage = () => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setLoading(true);
        const response = await api.get('/grades');
        setGrades(response.data.grades || []);
        setGpa(response.data.gpa);
      } catch (error) {
        console.error('Error loading grades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);

  const getGradeColor = (grade) => {
    if (!grade || grade === 'N/A' || grade === 'In Progress') return 'bg-gray-100 text-gray-700';
    if (grade === 'A' || grade === 'A+') return 'bg-emerald-100 text-emerald-700';
    if (grade === 'A-' || grade === 'B+') return 'bg-blue-100 text-blue-700';
    if (grade === 'B') return 'bg-cyan-100 text-cyan-700';
    if (grade === 'B-' || grade === 'C+') return 'bg-yellow-100 text-yellow-700';
    if (grade === 'C'|| grade === 'C-') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getScoreBarColor = (score) => {
    if (!score) return 'bg-gray-300';
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Academic Performance 📈</h1>
        <p className="text-purple-100">View your grades and academic progress</p>
      </div>

      {/* GPA Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-semibold mb-2">Current GPA</p>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray={`${(gpa / 4.0) * 339.3} 339.3`}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-bold text-purple-600">{gpa.toFixed(2)}</p>
                <p className="text-xs text-gray-500">out of 4.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="font-bold text-gray-800 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Courses Completed</p>
              <p className="text-2xl font-bold text-blue-600">{grades.filter((g) => g.status === 'completed').length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-amber-600">{grades.filter((g) => g.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="font-bold text-gray-800 mb-4">Grade Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-emerald-600 w-6">A</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-xs text-gray-500">{grades.filter((g) => g.grade?.includes('A')).length}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-600 w-6">B</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-xs text-gray-500">{grades.filter((g) => g.grade?.includes('B')).length}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-yellow-600 w-6">C</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
              <span className="text-xs text-gray-500">{grades.filter((g) => g.grade?.includes('C')).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Grades */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Grades</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-lg">🔄 Loading grades...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grades.length > 0 ? (
              grades.map((item, idx) => (
                <div key={item.course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800">{item.course.code} - {item.course.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                      </div>

                      {item.score !== null && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getScoreBarColor(item.score)}`}
                                style={{ width: `${Math.min(item.score, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{item.score}/100</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className={`text-4xl font-bold px-4 py-2 rounded-lg ${getGradeColor(item.grade)}`}>
                        {item.grade || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No grades available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesPage;
