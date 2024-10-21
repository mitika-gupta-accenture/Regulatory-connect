'use client';

import Header from './Header';
import CookieBanner from './CookieBanner';
import PhaseBanner from './PhaseBanner';
import Footer from './Footer';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../../authConfig';
import SkipLink from './SkipLink';
import { GridContainer } from '@mhra/mhra-design-components';
import '../../styles/app.scss';

const msalInstance = new PublicClientApplication(msalConfig);

type MainLayoutProps = {
  children: React.ReactNode;
  withSignOut: boolean;
}

export const MainLayout = ({ children, withSignOut }: MainLayoutProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="layout">
        <CookieBanner />
        <SkipLink />
        <Header withSignOut={withSignOut} />
        <main className="main-content">
          <GridContainer>
            <PhaseBanner data-testid="PhaseBanner-render" />
            {children}
          </GridContainer>
        </main>
        <Footer />
      </div>
    </MsalProvider>
  );
};
