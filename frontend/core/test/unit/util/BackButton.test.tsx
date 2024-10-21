import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackButton from '../../../util/BackButton'; // Adjust the import path as necessary
import { useRouter, usePathname } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('BackButton Component', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });

  test('renders Link with previousPage when previousPage is provided', () => {
    render(<BackButton previousPage="/previous-page" />);

    // Check if the Link is rendered with the correct href
    const link = screen.getByText('Back');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/previous-page');

    // Ensure the onClick handler is not called
    fireEvent.click(link);
    expect(mockBack).not.toHaveBeenCalled();
  });

  test('calls router.back when Link is clicked and no previousPage is provided', () => {
    render(<BackButton previousPage="" />);

    // Get the Link element
    const link = screen.getByText('Back');

    // Simulate a click event
    fireEvent.click(link);

    // Check if router.back() is called
    expect(mockBack).toHaveBeenCalled();
  });
});
