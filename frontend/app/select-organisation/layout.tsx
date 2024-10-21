'use client';

import { ReactNode } from 'react';
import { GridCol, GridRow } from '@mhra/mhra-design-components';
import BackButton from 'core/util/BackButton';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <main className="govuk-main-wrapper">
      <GridRow>
        <GridCol className="two-thirds">
          <BackButton previousPage={''} />

          {children}
          {/* <RedirectByUser isPage={false} /> */}
        </GridCol>
      </GridRow>
    </main>
  );
}

export default App;
