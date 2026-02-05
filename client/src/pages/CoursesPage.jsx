import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const CoursesPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else if (filter === 'enrolled') {
      setFilteredCourses(courses.filter((c) => c.enrolled));
    } else if (filter === 'available') {
      setFilteredCourses(courses.filter((c) => !c.enrolled));
    }
  }, [filter, courses]);

  const addCourse = async (id) => {
    try {
      const response = await api.post(`/courses/${id}/add`);
      setMessage(response.data.message);
      setShowModal(false);
      setTimeout(() => setMessage(''), 3000);
      loadCourses();
    } catch (error) {
      setMessage('Error adding course: ' + (error.response?.data?.message || 'Please try again'));
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const dropCourse = async (id) => {
    try {
      const response = await api.post(`/courses/${id}/drop`);
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 3000);
      loadCourses();
    } catch (error) {
      setMessage('Error dropping course');
    }
  };

  const getCapacityStatus = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return { label: '🔴 Almost Full', color: 'text-red-600' };
    if (percentage >= 70) return { label: '🟡 Limited Spots', color: 'text-amber-600' };
    return { label: '🟢 Seats Available', color: 'text-emerald-600' };
  };

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const CourseCard = ({ course }) => {
    const { label, color } = getCapacityStatus(course.enrolled_count, course.capacity);
    const isFull = course.enrolled_count >= course.capacity;

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden border border-gray-200 cursor-pointer"
           onClick={() => openCourseModal(course)}>
        {/* Card Header with gradient */}
        <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="p-6">
          {/* Course Code & Status */}
          <div className="flex items-start justify-between mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {course.code}
            </span>
            {course.enrolled && (
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                ✓ Enrolled
              </span>
            )}
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{course.title}</h3>

          {/* Quick Info */}
          <div className="space-y-2 mb-5 text-sm text-gray-600 border-y border-gray-200 py-4">
            <div className="flex items-center justify-between">
              <span>👨‍🏫 Instructor</span>
              <span className="font-semibold text-gray-800 text-right">{course.instructor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📚 Credits</span>
              <span className="font-semibold text-gray-800">{course.credits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🕐 Schedule</span>
              <span className="font-semibold text-gray-800 text-right text-xs">{course.timeslot}</span>
            </div>
          </div>

          {/* Capacity Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${color}`}>{label}</span>
              <span className="text-xs text-gray-500">{course.enrolled_count}/{course.capacity} spots</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  course.enrolled_count >= course.capacity
                    ? 'bg-red-500'
                    : course.enrolled_count >= course.capacity * 0.7
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((course.enrolled_count / course.capacity) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Prerequisites Badge */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mb-4 text-xs bg-blue-50 border border-blue-200 rounded-lg p-2 text-blue-700">
              <strong>Prerequisites:</strong> {course.prerequisites.join(', ')}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {course.enrolled ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to drop this course?')) {
                    dropCourse(course.id);
                  }
                }}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Drop Course
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isFull) {
                    addCourse(course.id);
                  }
                }}
                disabled={isFull}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                {isFull ? 'Course Full' : 'Add Course'}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openCourseModal(course);
              }}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Course Details Modal
  const CourseDetailsModal = ({ course }) => {
    if (!course) return null;

    const { label } = getCapacityStatus(course.enrolled_count, course.capacity);
    const isFull = course.enrolled_count >= course.capacity;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 sticky top-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-bold mb-2">
                  {course.code}
                </div>
                <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
                <p className="text-blue-100">Instructor: {course.instructor}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold text-white hover:text-blue-100 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">📖 Course Description</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Credits</p>
                <p className="text-2xl font-bold text-blue-600">{course.credits}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Grading</p>
                <p className="text-lg font-bold text-purple-600">{course.grading}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Class Size</p>
                <p className="text-lg font-bold text-emerald-600">{course.enrolled_count}/{course.capacity}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Status</p>
                <p className="text-lg font-bold text-amber-600">{label}</p>
              </div>
            </div>

            {/* Schedule Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">🕐 Schedule</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-800">{course.timeslot}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Room</span>
                  <span className="font-semibold text-gray-800">{course.room}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-semibold text-gray-800">{course.semester}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">📋 Prerequisites</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq) => (
                      <span key={prereq} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">
                        {prereq}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    ℹ️ You must have completed these courses before enrolling.
                  </p>
                </div>
              </div>
            )}

            {/* Capacity Warning */}
            {isFull && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-1">🔴 Course Full</h4>
                <p className="text-red-800 text-sm">
                  This course has reached maximum capacity. You can join the waitlist if available.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {course.enrolled ? (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to drop this course?')) {
                      dropCourse(course.id);
                      setShowModal(false);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Drop Course
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isFull) {
                      addCourse(course.id);
                    }
                  }}
                  disabled={isFull}
                  className="flex-1 bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {isFull ? 'Course Full - Join Waitlist' : 'Enroll in Course'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Course Catalog 📚</h1>
        <p className="text-blue-100">Browse available courses and manage your enrollment for this semester</p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-lg animate-pulse">
          <p className="font-semibold">✓ {message}</p>
          <button onClick={() => setMessage('')} className="text-xl hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
          }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setFilter('enrolled')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'enrolled'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-400'
          }`}
        >
          Enrolled ({courses.filter((c) => c.enrolled).length})
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'available'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
          }`}
        >
          Available ({courses.filter((c) => !c.enrolled).length})
        </button>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">🔄 Loading courses...</p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-5xl mb-4">📚</p>
              <p className="text-gray-500 text-lg">No courses found in this category</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </>
      )}

      {/* Course Details Modal */}
      {showModal && <CourseDetailsModal course={selectedCourse} />}

      {/* Info Card */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Course Enrollment Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Click "Details" to see full course information including prerequisites</li>
          <li>✓ Check seat availability before enrolling</li>
          <li>✓ Make sure you've completed all prerequisites</li>
          <li>✓ You can drop courses anytime before the deadline</li>
          <li>✓ Maximum credit limit is 18 credits per semester</li>
        </ul>
      </div>
    </div>
  );
};

export default CoursesPage;
