import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CoursesPage from '../pages/CoursesPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ id: '1', code: 'CS101', title: 'Intro', credits: 3, instructor: 'Dr. Ada', timeslot: 'Mon 09:00-11:00' }] })),
  post: jest.fn(() => Promise.resolve({ data: { message: 'Enrolled' } }))
}));

test('renders course catalog', async () => {
  render(renderWithProviders(<CoursesPage />));
  await waitFor(() => expect(screen.getByText('CS101 - Intro')).toBeInTheDocument());
});
