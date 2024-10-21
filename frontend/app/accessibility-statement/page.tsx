'use client';
import { GridCol, GridRow, GridWrapper } from '@mhra/mhra-design-components';

export default function AccessibilityStatement() {
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <div id="main-content">
            <br />
            <h1 className="govuk-heading-xl">
              Accessibility statement for Medicines Website Checker
            </h1>
            <p className="govuk-body">
              This website is run by the Medicines and Healthcare products
              Regulatory Agency. We want as many people as possible to be able
              to use this website. For example, that means you should be able
              to:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>change colours, contrast levels and fonts</li>
              <li>
                zoom in up to 300% without the text spilling off the screen
              </li>
              <li>navigate most of the website using just a keyboard</li>
              <li>listen to most of the website using a screen reader</li>
            </ul>
            <p className="govuk-body">
              We've also tried to make the content simple to understand.
            </p>
            <p className="govuk-body">
              There are many ways of making your device easier to use if you
              have access needs. Find out more on the{' '}
              <a
                id="govuk-ability-net-link"
                href="https://mcmw.abilitynet.org.uk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AbilityNet
              </a>
              .
            </p>
            <h2 className="govuk-heading-l">How accessible this website is</h2>
            <p className="govuk-body">
              This website is fully compliant with accessibility standards.
            </p>
            <h2 className="govuk-heading-l">
              What to do if you cannot access parts of this website
            </h2>
            <p className="govuk-body">
              If you need information on this website in a different format like
              an accessible PDF, large print, easy read, audio recording or
              braille:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>
                email:{' '}
                <a
                  id="govuk-web-updates-link"
                  href="mailto:webupdates@mhra.gov.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  webupdates@mhra.gov.uk
                </a>
              </li>
            </ul>
            <p className="govuk-body">
              We will consider your request and get back to you in 18 working
              days.
            </p>

            <h2 className="govuk-heading-l">
              Reporting accessibility problems with this website
            </h2>
            <p className="govuk-body">
              We are always looking to improve the accessibility of this
              website. If you find any problems not listed on this page or think
              we are not meeting accessibility requirements,
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>
                contact:{' '}
                <a
                  id="govuk-web-updates-link-2"
                  href="mailto:webupdates@mhra.gov.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  webupdates@mhra.gov.uk
                </a>
              </li>
            </ul>
            <p className="govuk-body">
              This email will go to our News, Digital and Content Team.
            </p>
            <h2 className="govuk-heading-l">Enforcement procedure</h2>
            <p className="govuk-body">
              The Equality and Human Rights Commission (EHRC) is responsible for
              enforcing the Public Sector Bodies (Websites and Mobile
              Applications) (No. 2) Accessibility Regulations 2018 (the
              'accessibility regulations'). If you're not happy with how we
              respond to your complaint, contact the{' '}
              <a
                id="govuk-equality-advisory-service-link"
                href="https://www.equalityadvisoryservice.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Equality Advisory and Support Service (EASS)
              </a>
              .
            </p>
            <h2 className="govuk-heading-l">
              Technical information about this website's accessibility
            </h2>
            <p className="govuk-body">
              The Medicines and Healthcare products Regulatory Agency is
              committed to making its website accessible, in accordance with the
              Public Sector Bodies (Websites and Mobile Applications) (No. 2)
              Accessibility Regulations 2018.
            </p>
            <p className="govuk-body">
              This website is fully compliant with the{' '}
              <a
                id="govuk-w3-standard-link"
                href="https://www.w3.org/TR/WCAG21/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Web Content Accessibility Guidelines version 2.1 AA standard
              </a>
              .
            </p>
            <h2 className="govuk-heading-l">How we have tested this website</h2>
            <p className="govuk-body">
              This website has been thoroughly tested during the final quarter
              of 2023. The test has been carried out by the internal testing and
              development team at the Medicines and Healthcare products
              Regulatory Agency. We have used the following testing approach
              below. The functions of the website have been tested on:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>Chrome</li>
              <li>Firefox</li>
              <li>Microsoft Edge</li>
            </ul>
            <p className="govuk-body">
              We have used a colour picker tool and the WCAG site to check
              colour contrast. We have tested our website on both iOS (using
              Apple mobile devices) and Android (using Samsung mobile devices)
              to ensure that it works seamlessly across different platforms. In
              addition, within our CI/CD pipeline we have integrated Pa11y
              accessibility testing and an OWASP ZAP Baseline Scan to test the
              security level of our website. This statement was prepared on 10
              October 2023. It was last updated on 10 October 2023.
            </p>
            <p></p>
          </div>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}
