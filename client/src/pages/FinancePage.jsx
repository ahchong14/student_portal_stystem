import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const FinancePage = () => {
  const { t } = useTranslation();
  const [statement, setStatement] = useState(null);

  const load = async () => {
    const response = await api.get('/finance/statement');
    setStatement(response.data);
  };

  const payNow = async () => {
    await api.post('/finance/pay', { amount: 500 });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  if (!statement) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('finance')}</h1>
      <p>{t('statement')}: Balance due ${statement.balanceDue}</p>
      <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={payNow}>
        {t('payNow')}
      </button>
      <ul className="space-y-2">
        {statement.payments.map((payment) => (
          <li key={payment.id} className="rounded border bg-white p-3">
            {payment.reference} - {payment.status}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FinancePage;
