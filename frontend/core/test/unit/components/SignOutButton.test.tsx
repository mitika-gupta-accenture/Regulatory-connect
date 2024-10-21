import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignOutButton } from '../../../components/SignOutButton';
import { useMsal } from '@azure/msal-react';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
}));

describe('SignOutButton', () => {
  const mockUseMsal = useMsal as jest.Mock;
  beforeEach(() => {
    mockUseMsal.mockReset();
  });

  test('renders with children', () => {
    mockUseMsal.mockReturnValue({
      instance: {
        logoutRedirect: jest.fn(),
      },
    });
    render(<SignOutButton>Logout</SignOutButton>);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logoutRedirect on click', () => {
    const mockLogoutRedirect = jest.fn();
    mockUseMsal.mockReturnValue({
      instance: {
        logoutRedirect: mockLogoutRedirect,
      },
    });
    render(<SignOutButton>Logout</SignOutButton>);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogoutRedirect).toHaveBeenCalledWith({
      postLogoutRedirectUri: '/',
    });
    expect(mockLogoutRedirect).toHaveBeenCalledTimes(1);
  });
});
