'use client';
import { Footer } from '@mhra/mhra-design-components';
import Link from 'next/link';

const FooterComponent = () => {
  return (
    <Footer name={'footer'} id="footer-1">
      <Link href="/" className="govuk-footer__link">
        Help
      </Link>
      <Link
        href="https://www.gov.uk/government/publications/mhra-privacy-notice/mhra-privacy-notice"
        className="govuk-footer__link"
      >
        Privacy
      </Link>
      <Link
        href="https://cms.mhra.gov.uk/cookie-policy"
        className="govuk-footer__link"
      >
        Cookies
      </Link>
      <Link
        href="https://products.mhra.gov.uk/accessibility/"
        className="govuk-footer__link"
      >
        Accessibility statement
      </Link>
      <Link href="/contactmhra" className="govuk-footer__link">
        Contact
      </Link>
      <Link
        href="https://info.mhra.gov.uk/forms/terms_and_conditions.aspx"
        className="govuk-footer__link"
      >
        Terms and conditions
      </Link>
    </Footer>
  );
};
export default FooterComponent;
