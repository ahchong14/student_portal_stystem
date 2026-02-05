import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FinancePage from '../pages/FinancePage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: { balanceDue: 1000, payments: [] } })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

test('renders finance statement', async () => {
  render(renderWithProviders(<FinancePage />));
  await waitFor(() => expect(screen.getByText(/Balance due/)).toBeInTheDocument());
});
