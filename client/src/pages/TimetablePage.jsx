import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const TimetablePage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);

  const load = async () => {
    const response = await api.get('/timetable');
    setCourses(response.data);
  };

  const exportIcal = async () => {
    const response = await api.get('/timetable/ical', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timetable.ics');
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('timetable')}</h1>
      <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={exportIcal}>
        Export iCal
      </button>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id} className="rounded border bg-white p-3">
            {course.code} - {course.title} ({course.timeslot})
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TimetablePage;
