import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export const renderWithProviders = (ui) => (
  <I18nextProvider i18n={i18n}>
    <MemoryRouter>{ui}</MemoryRouter>
  </I18nextProvider>
);
