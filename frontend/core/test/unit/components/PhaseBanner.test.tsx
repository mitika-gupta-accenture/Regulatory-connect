import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PhaseBanner from '../../../components/PhaseBanner';

describe('PhaseBanner', () => {
  it('Renders Banner', () => {
    render(<PhaseBanner />);
    waitFor(() => expect(screen.getByTestId('feedback')).toBeInTheDocument());
  });
  test('Correct link when feedback is clicked', () => {
    render(<PhaseBanner />);
    const PhaseBannerLink = screen.getByText(
      'give your feedback (opens in new tab)',
    );
    expect(PhaseBannerLink).toHaveAttribute('href');
  });
});
