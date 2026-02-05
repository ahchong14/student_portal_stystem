import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPage from '../pages/AdminPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));

test('renders admin page', () => {
  render(renderWithProviders(<AdminPage />));
  expect(screen.getByText('Admin')).toBeInTheDocument();
});
