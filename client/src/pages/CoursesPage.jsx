import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const CoursesPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    const response = await api.get('/courses');
    setCourses(response.data);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = async (id) => {
    const response = await api.post(`/courses/${id}/add`);
    setMessage(response.data.message);
  };

  const dropCourse = async (id) => {
    const response = await api.post(`/courses/${id}/drop`);
    setMessage(response.data.message);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('catalog')}</h1>
      {message && <p className="rounded bg-blue-50 p-2 text-blue-700">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="rounded border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{course.code} - {course.title}</h2>
            <p className="text-sm text-gray-600">Credits: {course.credits} | {course.instructor}</p>
            <p className="text-sm text-gray-600">Timeslot: {course.timeslot}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => addCourse(course.id)} className="rounded bg-green-600 px-3 py-1 text-white">
                {t('addCourse')}
              </button>
              <button onClick={() => dropCourse(course.id)} className="rounded bg-red-600 px-3 py-1 text-white">
                {t('dropCourse')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesPage;
