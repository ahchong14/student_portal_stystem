import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage';
import { renderWithProviders } from './testUtils';


test('renders dashboard page', () => {
  render(renderWithProviders(<DashboardPage />));
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
