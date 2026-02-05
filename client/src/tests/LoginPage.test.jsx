import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { renderWithProviders } from './testUtils';

jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { accessToken: 'token', refreshToken: 'refresh' } }))
}));


test('renders login form', () => {
  render(renderWithProviders(<LoginPage />));
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});
