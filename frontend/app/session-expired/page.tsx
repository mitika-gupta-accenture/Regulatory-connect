'use server';

import React from 'react';
import Link from 'next/link';
import Button from '../../core/components/Button';
import { GridWrapper, GridCol, GridRow } from '@mhra/mhra-design-components';

const SessionExpired = async () => {
  const sessionExpiration = process.env.SESSION_TTL ?? 10;

  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <br />
          <h1 className="govuk-heading-l">You have been signed out</h1>
          <p className="govuk-body">
            You have been signed out and any information you have not saved has{' '}
            been deleted because you did not do anything for {sessionExpiration}{' '}
            minutes. This is to protect your information.
          </p>
          <GridRow>
            <Link href="/">
              <Button
                disabled={false}
                name="start-again-button"
                text={'Sign back in'}
              ></Button>
            </Link>
          </GridRow>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
};

export default SessionExpired;
