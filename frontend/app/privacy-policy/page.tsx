'use client';

import React from 'react';
import { GridWrapper, GridCol, GridRow } from '@mhra/mhra-design-components';

const PrivacyPolicy = () => {
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <h1 className="govuk-heading-xl">
            Privacy notice for Home Office Workforce
          </h1>
          <p className="govuk-body">
            Provision of the I-LEAP Search Person demonstrator is from ILED and
            the DDaT directorate, both of which are part of the Home Office.
          </p>
          <p className="govuk-body">
            This application does not use live (real) data and data is either
            mocked by the development team or provided by the Interpol FIND test
            systems.
          </p>

          <h2 className="govuk-heading-l">What data we need</h2>
          <p className="govuk-body">
            No data is collected by this application.
          </p>

          <h2 className="govuk-heading-l">Why we need it</h2>
          <p className="govuk-body">
            We don't collect any personal information as it is not required by
            the demonstrator. Feedback on the application is provided in
            realtime during the sessions/workshops it is presented in or by
            email to our shared mailboxes.
          </p>

          <h2 className="govuk-heading-l">What we do with your data</h2>
          <p className="govuk-body">Nothing.</p>
          <p className="govuk-body">We will not:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>sell or rent your data to third parties</li>
            <li>share your data with third parties for marketing purposes</li>
          </ul>

          <h2 className="govuk-heading-l">Changes to this notice</h2>
          <p className="govuk-body">
            We may modify or amend this privacy notice at our discretion at any
            time. When we make changes to this notice, we will amend the last
            modified date at the top of this page. Any modification or amendment
            to this privacy notice will be applied to you and your data as of
            that revision date. We encourage you to periodically review this
            privacy notice to be informed about how we are protecting your data.
          </p>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
};

export default PrivacyPolicy;
