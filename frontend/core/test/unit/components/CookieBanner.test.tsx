import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CookieBanner from '../../../components/CookieBanner';

describe('CookieBanner component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('should render banner when JavaScript is enabled and cookies are not accepted', () => {
    window.localStorage.getItem.mockReturnValueOnce(null);
    const { getByLabelText, getByText } = render(<CookieBanner />);
    expect(getByLabelText('Cookies on [name of service]')).toBeInTheDocument();
    expect(getByText('Accept analytics cookies')).toBeInTheDocument();
    expect(getByText('Reject analytics cookies')).toBeInTheDocument();
  });

  it('should not render banner when cookies are already accepted', () => {
    window.localStorage.getItem.mockReturnValueOnce('true');
    const { queryByLabelText } = render(<CookieBanner />);
    expect(queryByLabelText('Cookies on [name of service]')).toBeNull();
  });

  it('should handle accept cookies action', () => {
    window.localStorage.getItem.mockReturnValueOnce(null);
    const { getByText } = render(<CookieBanner />);
    fireEvent.click(getByText('Accept analytics cookies'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'cookieAccepted',
      'true',
    );
  });

  it('should handle reject cookies action', () => {
    window.localStorage.getItem.mockReturnValueOnce(null);
    const { getByText } = render(<CookieBanner />);
    fireEvent.click(getByText('Reject analytics cookies'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'cookieAccepted',
      'false',
    );
  });

  it('hides the banner when "Accept" button is clicked', () => {
    const { getByRole, queryByRole } = render(<CookieBanner />);
    const acceptButton = getByRole('button', {
      name: /Accept analytics cookies/i,
    });
    fireEvent.click(acceptButton);
    const banner = queryByRole('region', {
      name: /Cookies on Medicines Website Checker/i,
    });
    expect(banner).not.toBeInTheDocument();
  });
  
  it('hides the banner when "Reject" button is clicked', () => {
    const { getByRole, queryByRole } = render(<CookieBanner />);
    const rejectButton = getByRole('button', {
      name: /Reject analytics cookies/i,
    });
    fireEvent.click(rejectButton);
    const banner = queryByRole('region', {
      name: /Cookies on Medicines Website Checker/i,
    });
    expect(banner).not.toBeInTheDocument();
  });

  it('hides the message when "Hide" button is clicked', () => {
    const { getByRole, queryByText } = render(<CookieBanner />);
    const acceptButton = getByRole('button', {
      name: /Accept analytics cookies/i,
    });
    fireEvent.click(acceptButton);
    const hideButton = getByRole('button', { name: /Hide cookie message/i });
    fireEvent.click(hideButton);
    const message = queryByText(/You've accepted analytics cookies/i);
    expect(message).not.toBeInTheDocument();
  });

  describe('CookieBanner component', () => {
    it('shows the banner when JavaScript is enabled', () => {
      const { getByText } = render(<CookieBanner />);
      const bannerContent = getByText(/Cookies on Medicines Website Checker/i);
      expect(bannerContent).toBeInTheDocument();
    });
  });
});
