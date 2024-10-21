import { Button, GridWrapper } from '@mhra/mhra-design-components';
import Link from 'next/link';
import React from 'react';

export default function NotAuthorisedToOnboard() {
  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content">
            <span className="govuk-caption-xl">Onboard an organisation</span>
            <h1 className="govuk-heading-xl">
              You are not authorised to act on behalf of your organisation
            </h1>
            <p className="govuk-body">
              You must receive approval from from your organisation admin to act
              on its behalf.
            </p>
            <p className="govuk-body govuk-!-font-weight-bold">
              If you need help
            </p>
            <p className="govuk-body">
              <a
                className="govuk-link"
                href="https://www.gov.uk/guidance/contact-mhra"
              >
                Contact MHRA (opens in a new tab)
              </a>{' '}
              if you have any questions about registering on RegulatoryConnect.
            </p>
            <Link href={'/'}>
              <Button
                disabled={false}
                name="return-to-homepage"
                text={'Return to homepage'}
              ></Button>
            </Link>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}
