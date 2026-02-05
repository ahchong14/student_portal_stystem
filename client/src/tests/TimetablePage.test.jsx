import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TimetablePage from '../pages/TimetablePage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ id: '1', code: 'CS101', title: 'Intro', timeslot: 'Mon 09:00-11:00' }] }))
}));

test('renders timetable list', async () => {
  render(renderWithProviders(<TimetablePage />));
  await waitFor(() => expect(screen.getByText(/CS101/)).toBeInTheDocument());
});
