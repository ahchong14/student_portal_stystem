import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/ProfilePage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: { fullName: 'Student A' } })),
  put: jest.fn(() => Promise.resolve({ data: { fullName: 'Student A' } }))
}));

test('renders profile page', async () => {
  render(renderWithProviders(<ProfilePage />));
  await waitFor(() => expect(screen.getByDisplayValue('Student A')).toBeInTheDocument());
});
