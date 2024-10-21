'use client';

import React from 'react';
import {
  GridContainer,
  GridWrapper,
  GridCol,
  GridRow,
  Heading,
  Paragraph,
} from '@mhra/mhra-design-components';

const WhichProcedure = () => {
  return (
    <GridContainer>
      <GridWrapper>
        <GridRow>
          <GridCol className="two-thirds">
            <Heading
              size="xl"
              text="Privacy notice for Home Office Workforce"
            />
            <Paragraph
              text={
                ' Provision of the I-LEAP Search Person demonstrator is from ILED and the DDaT directorate, both of which are part of the Home Office.'
              }
              id={''}
            />
            <Paragraph
              text={
                'This application does not use live (real) data and data is either mocked by the development team or provided by the Interpol FIND test systems.'
              }
              id={''}
            />

            <Heading size="l" text="What data we need" />
            <Paragraph
              text={'No data is collected by this application.'}
              id={''}
            />
            <Heading size="l" text="Why we need it" />
            <Paragraph
              text={
                " We don't collect any personal information as it is not required by the demonstrator Feedback on the application is provided in realtime during the sessions/workshops it is presented in or by email to our shared mailboxes."
              }
              id={''}
            />

            <Heading size="l" text="What we do with your data" />
            <Paragraph text="Nothing." id="" />
            <Paragraph text="We will not:" id="" />
            <ul className="govuk-list govuk-list--bullet">
              <li>sell or rent your data to third parties</li>
              <li>share your data with third parties for marketing purposes</li>
            </ul>

            <Heading size="l" text={'Changes to this notice'} />
            <Paragraph
              text="We may modify or amend this privacy notice at our discretion at
              any time. When we make changes to this notice, we will amend the
              last modified date at the top of this page. Any modification or
              amendment to this privacy notice will be applied to you and your
              data as of that revision date. We encourage you to periodically
              review this privacy notice to be informed about how we are
              protecting your data."
              id=""
            />
          </GridCol>
        </GridRow>
      </GridWrapper>
    </GridContainer>
  );
};

export default WhichProcedure;
