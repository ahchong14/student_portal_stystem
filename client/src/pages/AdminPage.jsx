import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const AdminPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);

  const search = async () => {
    const response = await api.get('/admin/students', { params: { q: query } });
    setStudents(response.data);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('admin')}</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded border px-3 py-2"
          placeholder="Search students"
        />
        <button onClick={search} className="rounded bg-blue-600 px-3 py-2 text-white">Search</button>
      </div>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student.id} className="rounded border bg-white p-3">
            {student.email} - {student.StudentProfile?.fullName || 'N/A'}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPage;
