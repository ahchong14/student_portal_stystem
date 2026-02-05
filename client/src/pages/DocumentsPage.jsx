import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const DocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/documents', formData);
      setUploadSuccess('Document uploaded successfully! ✓');
      setFile(null);
      setTimeout(() => setUploadSuccess(''), 3000);
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      transcript: '📜',
      audit: '📋',
      verification: '✅',
      general: '📄',
    };
    return icons[type] || '📄';
  };

  const getStatusColor = (status) => {
    const colors = {
      ready: 'bg-emerald-100 text-emerald-700',
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-amber-100 text-amber-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ready: '✓ Ready',
      processing: '⏳ Processing',
      pending: '⏱️ Pending',
      rejected: '✕ Rejected',
    };
    return icons[status] || status;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Documents 📄</h1>
        <p className="text-indigo-100">Request and manage your academic documents</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Document</h2>
        <div className="space-y-4">
          {uploadSuccess && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">{uploadSuccess}</p>
              <button onClick={() => setUploadSuccess('')} className="text-xl">✕</button>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-4">📤</div>
              <p className="text-gray-700 font-semibold">
                {file ? file.name : 'Drag and drop your file or click to browse'}
              </p>
              <p className="text-gray-500 text-sm mt-2">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '⏳ Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {/* Quick Request Buttons */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Transcript', type: 'transcript' },
            { name: 'Degree Audit', type: 'audit' },
            { name: 'Verification Letter', type: 'verification' },
            { name: 'Enrollment Verification', type: 'verification' },
          ].map((doc, idx) => (
            <button
              key={idx}
              className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="text-3xl mb-2">{getDocumentIcon(doc.type)}</div>
              <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500 mt-2">Request now</p>
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Documents</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-lg">🔄 Loading documents...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">{getDocumentIcon(doc.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{doc.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>📅 Requested: {new Date(doc.requestDate).toLocaleDateString()}</span>
                          <span>🕐 Due: {new Date(doc.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                        getStatusColor(doc.status)
                      }`}>
                        {getStatusIcon(doc.status)}
                      </span>
                      {doc.status === 'ready' && (
                        <button className="block mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold">
                          ⬇️ Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 text-lg">No documents yet</p>
                <p className="text-gray-400 text-sm mt-2">Request a document using the upload section above</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">📌 Document Processing Times</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Transcripts: 2-3 business days</li>
          <li>✓ Degree Audits: 1-2 business days</li>
          <li>✓ Verification Letters: 1 business day</li>
          <li>✓ Special Requests: Contact the Registrar</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentsPage;
