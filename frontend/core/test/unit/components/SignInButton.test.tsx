import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignInButton } from '../../../components/SignInButton';
import { useMsal } from '@azure/msal-react';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
}));

describe('SignInButton', () => {
  const mockUseMsal = useMsal as jest.Mock;
  beforeEach(() => {
    mockUseMsal.mockReset();
  });

  test('renders with children', () => {
    mockUseMsal.mockReturnValue({
      instance: {
        loginRedirect: jest.fn(() => Promise.resolve()),
      },
    });
    render(<SignInButton>Login</SignInButton>);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('calls loginRedirect on click', () => {
    const mockLoginRedirect = jest.fn(() => Promise.resolve());
    mockUseMsal.mockReturnValue({
      instance: {
        loginRedirect: mockLoginRedirect,
      },
    });
    render(<SignInButton>Login</SignInButton>);
    fireEvent.click(screen.getByText('Login'));
    expect(mockLoginRedirect).toHaveBeenCalledTimes(1);
  });

  test('logs error when loginRedirect fails', () => {
    const mockLoginRedirect = jest.fn(() => Promise.reject('Error'));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockUseMsal.mockReturnValue({
      instance: {
        loginRedirect: mockLoginRedirect,
      },
    });
    render(<SignInButton>Login</SignInButton>);
    fireEvent.click(screen.getByText('Login'));
    return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error');
      consoleSpy.mockRestore();
    });
  });
});
