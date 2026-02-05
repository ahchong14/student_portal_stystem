import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../pages/RegisterPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { verificationToken: 'token' } }))
}));

test('renders register form', () => {
  render(renderWithProviders(<RegisterPage />));
  expect(screen.getByText('Register')).toBeInTheDocument();
});
