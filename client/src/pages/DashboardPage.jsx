import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('dashboard')}</h1>
      <p className="text-gray-700">{t('welcome')}! Use the navigation above to access your student services.</p>
    </section>
  );
};

export default DashboardPage;
