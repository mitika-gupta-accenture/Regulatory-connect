// NotFound.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from '../../../app/not-found'; // Adjust the path as necessary

// Mock the BackButton component
jest.mock('../../../core/util/BackButton', () => ({}) => (
  <button data-testid="back-button" onClick={() => {}}>
    Go Back
  </button>
));

describe('NotFound Component', () => {
  test('renders NotFound component correctly', () => {
    render(<NotFound />);

    // Check if the BackButton is rendered
    expect(screen.getByTestId('back-button')).toBeInTheDocument();

    // Check if the heading is rendered
    expect(screen.getByText('Page not found')).toBeInTheDocument();

    // Check if the paragraphs are rendered with correct text
    expect(
      screen.getByText('If you typed the web address, check it is correct.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If you pasted the web address, check you copied the entire address.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If the web address is correct or you selected a link or button,',
      ),
    ).toBeInTheDocument();

    // Check if the headings and links are rendered
    expect(screen.getByText('What can you do now')).toBeInTheDocument();
    expect(screen.getByText('Return to Applications')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Have a query, or experiencing an issue with this page?',
      ),
    ).toBeInTheDocument();
  });
});
