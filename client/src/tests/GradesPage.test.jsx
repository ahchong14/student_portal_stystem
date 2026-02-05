import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GradesPage from '../pages/GradesPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({
    data: { grades: [{ course: { id: '1', code: 'CS101', title: 'Intro' }, grade: 'A', status: 'published' }], gpa: 4.0 }
  }))
}));

test('renders grades and gpa', async () => {
  render(renderWithProviders(<GradesPage />));
  await waitFor(() => expect(screen.getByText(/GPA/)).toBeInTheDocument());
});
