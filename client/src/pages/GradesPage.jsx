import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const GradesPage = () => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    api.get('/grades').then((response) => {
      setGrades(response.data.grades || []);
      setGpa(response.data.gpa);
    });
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('grades')}</h1>
      <p>GPA: {gpa}</p>
      <div className="space-y-2">
        {grades.map((item) => (
          <div key={item.course.id} className="rounded border bg-white p-3">
            <p className="font-medium">{item.course.code} - {item.course.title}</p>
            <p>Grade: {item.grade || 'N/A'} ({item.status || 'pending'})</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GradesPage;
