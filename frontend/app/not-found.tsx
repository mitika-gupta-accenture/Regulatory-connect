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

const NotFound = () => {
  return (
    <>
      <BackButton previousPage={''} />
      <GridWrapper>
        <GridRow className="one-thirds">
          <GridCol className="govuk-!-margin-top-0">
            <Heading text={'Page not found'} />
            <Paragraph
              size="m"
              text={'If you typed the web address, check it is correct.'}
              id={'check-correct'}
            />
            <Paragraph
              size="m"
              text={
                'If you pasted the web address, check you copied the entire address.'
              }
              id={'web-address'}
            />
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
                id={'query-link'}
              />
            </div>
          </GridCol>
        </GridRow>
      </GridWrapper>
    </>
  );
};

export default NotFound;
