import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then((response) => setNotifications(response.data));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('notifications')}</h1>
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li key={item.id} className="rounded border bg-white p-3">
            {item.message}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationsPage;
