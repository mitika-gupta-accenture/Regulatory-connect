import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertions
import DownloadCSVLink from 'core/components/DownloadCsvLink';

describe('DownloadCSVLink Component', () => {
  test('should render without crashing', () => {
    render(<DownloadCSVLink />);
    expect(
      screen.getByText('Download your licence details to a .CSV file'),
    ).toBeInTheDocument();
  });

  test('should render a button with correct text', () => {
    render(<DownloadCSVLink />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveTextContent(
      'Download your licence details to a .CSV file',
    );
  });

  test('should apply the correct class to the button', () => {
    render(<DownloadCSVLink />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('convert-button-to-link');
  });
});
