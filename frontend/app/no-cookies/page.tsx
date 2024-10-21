import React from 'react';
import Link from 'next/link';
import Button from '../../core/components/Button';
import { GridWrapper, GridCol, GridRow } from '@mhra/mhra-design-components';

const NoCookies = () => {
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <br />
          <h1 className="govuk-heading-l">Cookies Disabled</h1>
          <p className="govuk-body">
            Please enable your cookies. Essential cookies are required in order
            to track your progress on this site.
          </p>
          <GridRow>
            <Link href="/">
              <Button
                disabled={false}
                name="start-again-button"
                text={'Start Again'}
              ></Button>
            </Link>
          </GridRow>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
};

export default NoCookies;
