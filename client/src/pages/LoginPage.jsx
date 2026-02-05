import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    const response = await api.post('/auth/login', data);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">{t('login')}</h1>
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
      <p className="mt-4 text-sm">
        {t('register')}? <Link to="/register" className="text-blue-600">{t('register')}</Link>
      </p>
    </div>
  );
};

export default LoginPage;
