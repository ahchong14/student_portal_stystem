import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    api.get('/students/profile').then((response) => setProfile(response.data || {}));
  }, []);

  const updateProfile = async () => {
    const response = await api.put('/students/profile', profile);
    setProfile(response.data);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('profile')}</h1>
      <div className="space-y-2">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Full Name"
          value={profile.fullName || ''}
          onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Contact Number"
          value={profile.contactNumber || ''}
          onChange={(event) => setProfile({ ...profile, contactNumber: event.target.value })}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Emergency Contact"
          value={profile.emergencyContactName || ''}
          onChange={(event) => setProfile({ ...profile, emergencyContactName: event.target.value })}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Emergency Phone"
          value={profile.emergencyContactPhone || ''}
          onChange={(event) => setProfile({ ...profile, emergencyContactPhone: event.target.value })}
        />
        <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={updateProfile}>
          Save
        </button>
      </div>
    </section>
  );
};

export default ProfilePage;
