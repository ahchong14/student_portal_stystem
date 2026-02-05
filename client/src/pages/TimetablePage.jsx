import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const TimetablePage = () => {
  const { t } = useTranslation();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/timetable');
      setTimetable(response.data);
    } catch (error) {
      console.error('Error loading timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportIcal = async () => {
    try {
      const response = await api.get('/timetable/ical', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'timetable.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting calendar:', error);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Class Timetable 🕐</h1>
            <p className="text-rose-100">Your course schedule for this semester</p>
          </div>
          <button
            onClick={exportIcal}
            className="bg-white text-rose-600 font-semibold px-6 py-3 rounded-lg hover:bg-rose-50 transition-all"
          >
            📅 Export Calendar
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-lg">🔄 Loading timetable...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timetable.map((day) => (
            <div key={day.day} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4 text-white">
                <h2 className="text-2xl font-bold">{day.day}</h2>
              </div>

              {/* Classes */}
              {day.events.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {day.events.map((event, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Course</p>
                          <p className="text-lg font-bold text-gray-800 mt-1">{event.course}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Time</p>
                          <p className="text-lg font-semibold text-rose-600 mt-1">🕐 {event.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Room</p>
                          <p className="text-lg font-semibold text-gray-800 mt-1">📍 {event.room}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Instructor</p>
                          <p className="text-lg font-semibold text-gray-800 mt-1">👨‍🏫 {event.instructor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No classes scheduled</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">📌 Timetable Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Export your timetable to your calendar app for notifications</li>
          <li>✓ Check your email for updates to class times or room changes</li>
          <li>✓ Arrive 5 minutes before class starts</li>
          <li>✓ Keep track of assignment deadlines in your course pages</li>
        </ul>
      </div>
    </div>
  );
};

export default TimetablePage;
