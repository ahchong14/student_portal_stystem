import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NotificationsPage from '../pages/NotificationsPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ id: '1', message: 'Notification' }] }))
}));

test('renders notifications', async () => {
  render(renderWithProviders(<NotificationsPage />));
  await waitFor(() => expect(screen.getByText('Notification')).toBeInTheDocument());
});
