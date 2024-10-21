import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import '../styles/app.scss';
import { AuthenticatedApp } from 'core/components/AuthenticateProtectedComponents';

interface AppProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: '%s - RegulatoryConnect - GOV.UK',
    default: 'RegulatoryConnect',
  },
};

async function App({ children }: AppProps) {
  return (
    <html lang="en">
      <body>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </body>
    </html>
  );
}

export default App;
