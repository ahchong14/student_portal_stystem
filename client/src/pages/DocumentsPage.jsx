import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const DocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const load = async () => {
    const response = await api.get('/documents');
    setDocuments(response.data);
  };

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/documents', formData);
    setFile(null);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('documents')}</h1>
      <div className="flex items-center gap-2">
        <input type="file" onChange={(event) => setFile(event.target.files[0])} />
        <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={upload}>
          {t('upload')}
        </button>
      </div>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="rounded border bg-white p-3">
            {doc.filename} - {doc.scanStatus}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DocumentsPage;
