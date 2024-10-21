import React from 'react';
import { render } from '@testing-library/react';
import FooterComponent from '../../../components/Footer';
import "@testing-library/jest-dom" 
describe('FooterComponent', () => {
  it('renders the Help link', () => {
    const { getByText } = render(<FooterComponent />);
    const helpLink = getByText('Help');
    expect(helpLink).toBeInTheDocument();
    expect(helpLink.getAttribute('href')).toBe('/');
  });

  it('renders the Privacy link', () => {
    const { getByText } = render(<FooterComponent />);
    const privacyLink = getByText('Privacy');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.getAttribute('href')).toBe(
      'https://www.gov.uk/government/publications/mhra-privacy-notice/mhra-privacy-notice',
    );
  });

  it('renders the Cookies link', () => {
    const { getByText } = render(<FooterComponent />);
    const cookiesLink = getByText('Cookies');
    expect(cookiesLink).toBeInTheDocument();
    expect(cookiesLink.getAttribute('href')).toBe(
      'https://cms.mhra.gov.uk/cookie-policy',
    );
  });

  it('renders the Accessibility statement link', () => {
    const { getByText } = render(<FooterComponent />);
    const accessibilityLink = getByText('Accessibility statement');
    expect(accessibilityLink).toBeInTheDocument();
    expect(accessibilityLink.getAttribute('href')).toBe(
      'https://products.mhra.gov.uk/accessibility/',
    );
  });

  it('renders the Contact link', () => {
    const { getByText } = render(<FooterComponent />);
    const contactLink = getByText('Contact');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.getAttribute('href')).toBe(
      '/contactmhra',
    );
  });

  it('renders the Terms and conditions link', () => {
    const { getByText } = render(<FooterComponent />);
    const termsLink = getByText('Terms and conditions');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink.getAttribute('href')).toBe(
      'https://info.mhra.gov.uk/forms/terms_and_conditions.aspx',
    );
  });
});


