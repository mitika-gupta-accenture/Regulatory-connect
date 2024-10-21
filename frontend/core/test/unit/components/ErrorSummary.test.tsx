import { render, screen } from '@testing-library/react';
import ErrorSummary, { ErrorSummaryType } from '../../../components/ErrorSummary';

describe('ErrorSummary Component', () => {
  let errorSummary: ErrorSummaryType;

  beforeEach(() => {
    errorSummary = {
      title: "Example Error Summary",
      errors: [
        { linkId: "/error1", message: "Error 1 message" },
        { linkId: "/error2", message: "Error 2 message" }
      ]
    };
  });

  it('Renders error summary with title and errors', () => {
    render(<ErrorSummary errorSummary={errorSummary} />);
    const errorSummaryTitle = screen.getByText(errorSummary.title);
    const errorLinks = screen.getAllByRole('link');
    expect(errorSummaryTitle).toBeInTheDocument();
    expect(errorLinks).toHaveLength(errorSummary.errors.length);
  });

  it('Renders individual error messages as links', () => {
    render(<ErrorSummary errorSummary={errorSummary} />);
    const errorLinks = screen.getAllByRole('link');
    errorSummary.errors.forEach((error, index) => {
      const link = errorLinks[index];
      expect(link).toHaveTextContent(error.message);
      expect(link).toHaveAttribute('href', error.linkId);
    });
  });
});
