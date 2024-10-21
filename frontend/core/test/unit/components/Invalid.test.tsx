import { render, screen } from '@testing-library/react';
import Invalid from 'core/components/Invalid';
import '@testing-library/jest-dom';

describe('Invalid Component', () => {

  test('should render without errors', () => {
    render(<Invalid />);
    
    const heading = screen.getByRole('heading', { name: /you have started to complete the MHRA-base-form/i });
    const paragraph = screen.getByText(/you do not need to complete this form for this route/i);
    
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  test('should render correct heading text', () => {
    render(<Invalid />);
    
    const heading = screen.getByRole('heading', { name: /you have started to complete the MHRA-base-form/i });
    expect(heading).toHaveTextContent(
      "You have started to complete the MHRA-base-form; you do not need to complete this form for this type of application."
    );
  });

  test('should render paragraph with correct text', () => {
    render(<Invalid />);
    
    const paragraph = screen.getByText(/you do not need to complete this form for this route/i);
    expect(paragraph).toHaveTextContent(
      "You do not need to complete this form for this route."
    );
  });

  test('should have the correct id for the main content div', () => {
    render(<Invalid />);
    
    const mainContentDiv = screen.getByTestId('main-content'); // Now using getByTestId
    expect(mainContentDiv).toBeInTheDocument();
  });
});