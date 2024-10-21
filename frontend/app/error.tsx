'use client';
import React from 'react';
import {
  GridRow,
  Heading,
  Paragraph,
  Link,
  GridWrapper,
  GridCol,
} from '@mhra/mhra-design-components';
import BackButton from '../core/util/BackButton';

const Error = () => {
  return (
    <>
      <BackButton previousPage={''} />
      <GridWrapper>
        <GridRow className="two-thirds">
          <GridCol className="govuk-!-margin-top-0">
            <Heading text={'Sorry, there is a problem with the service'} />
            <Paragraph size="m" text={'Try again later'} id={'try-again'} />
            <Paragraph
              size="m"
              text={
                'If the web address is correct or you selected a link or button, [contact MHRA to report this issue.](/contactmhra)'
              }
              id={'issue-link'}
            />
            <Heading
              className="govuk-heading-s"
              level={3}
              text={'What can you do now'}
            />
            <Link
              href={'/dashboard'}
              text={'Return to Applications'}
              id={'return-to-application'}
            />
            <br />
            <div className="govuk-!-margin-top-9">
              <Link
                href={'/contactmhra'}
                text={'Have a query, or experiencing an issue with this page?'}
                id={'issue-link'}
              />
            </div>
          </GridCol>
        </GridRow>
      </GridWrapper>
    </>
  );
};

export default Error;
