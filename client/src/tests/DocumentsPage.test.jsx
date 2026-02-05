import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DocumentsPage from '../pages/DocumentsPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ id: '1', filename: 'file.pdf', scanStatus: 'clean' }] })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

test('renders documents list', async () => {
  render(renderWithProviders(<DocumentsPage />));
  await waitFor(() => expect(screen.getByText(/file.pdf/)).toBeInTheDocument());
});
