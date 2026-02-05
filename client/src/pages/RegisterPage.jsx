import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    const response = await api.post('/auth/register', data);
    setMessage(`Verification token: ${response.data.verificationToken}`);
  };

  return (
    <div className="max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">{t('register')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('email')}
          className="w-full rounded border px-3 py-2"
          placeholder={t('email')}
        />
        <input
          type="password"
          {...register('password')}
          className="w-full rounded border px-3 py-2"
          placeholder={t('password')}
        />
        <button className="w-full rounded bg-blue-600 py-2 text-white">{t('submit')}</button>
      </form>
      {message && <p className="mt-4 rounded bg-green-50 p-2 text-sm text-green-700">{message}</p>}
    </div>
  );
};

export default RegisterPage;
