'use client';

import { ReactNode } from 'react';
import { GridCol, GridRow } from '@mhra/mhra-design-components';
import Link from 'core/components/Link';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <main className="govuk-main-wrapper govuk-!-margin-top-4">
      <GridRow>
        <GridCol className="two-thirds">
          <div className="govuk-panel govuk-panel--confirmation">
            <h1 className="govuk-panel__title">Invitation submitted</h1>
          </div>
          {children}
          <div style={{ marginTop: '2rem' }}>
            <Link
              href={'/dashboard/account-management'}
              id={'return-to-manage-users'}
              type="link"
            >
              Return to Manager users
            </Link>
          </div>
          <br />
          <div style={{ marginTop: '2rem' }}>
            <Link href={'/not-found'} id={'feedback'} type="link">
              What do you think of this service?
            </Link>
          </div>
          <br />
          <div style={{ marginTop: '5rem' }}>
            <a
              href={'/not-found'}
              id={'report-a-problem'}
              className="govuk-link"
              target="_blank"
            >
              Report a problem with this page (opens in a new tab)
            </a>
          </div>
        </GridCol>
      </GridRow>
    </main>
  );
}

export default App;
